/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { isEmpty } from 'lodash';
import DSLService from 'public/services/requests/dsl';
import {
  CatalogItem,
  DOT_AFTER_CATALOG,
  EMPTY_REGEX,
  EQUAL_AFTER_SOURCE,
  FieldItem,
  fillSuggestions,
  filterSuggestions,
  IndexItem,
  METRIC_AFTER_DOT,
  pipeCommands,
  regexForPromSuggestion,
  regexForCatalog,
  CATALOG_AFTER_EQUAL,
  PIPE_AFTER_METRIC,
} from '../../../../common/constants/autocomplete';

let currCatalog = '';
let currIndex = '';

const catalogList: string[] = [];
const indexList: string[] = [];
const fieldList: string[] = [];
const catalogsFromBackend: CatalogItem[] = [];
const indicesFromBackend: IndexItem[] = [];
const fieldsFromBackend: FieldItem[] = [];

const getCatalogs = async (DUMMY_API: any): Promise<void> => {
  if (catalogsFromBackend.length === 0) {
    const catalogs = await DUMMY_API.getListOfCatalogs();
    for (let i = 0; i < catalogs.length; i++) {
      catalogsFromBackend.push({
        label: catalogs[i],
      });
      catalogList.push(catalogs[i]);
    }
  }
};

const getIndices = async (DUMMY_API: any): Promise<void> => {
  if (!isEmpty(currCatalog)) {
    indicesFromBackend.length = 0;
    const catalog = currCatalog;
    const res = await DUMMY_API.getIndicesForCatalog(catalog);
    if (!res) {
      return;
    }
    for (let i = 0; i < res.length; i++) {
      indicesFromBackend.push({ label: res[i] });
      indexList.push(res[i]);
    }
  }
};

const getFields = async (DUMMY_API: any): Promise<void> => {
  if (!isEmpty(currIndex)) {
    fieldsFromBackend.length = 0;
    // for (let i = 0; i < currIndices.length; i++) {
    // const index = currIndices[i];
    const index = currIndex;
    const res = await DUMMY_API.fetchFields(index);
    if (!res) {
      // continue;
      return;
    }
    const resFieldList = Object.keys(res?.[index].mappings.properties);
    for (let j = 0; j < resFieldList.length; j++) {
      const element = resFieldList[j];
      if (
        res?.[index].mappings.properties[element].properties ||
        res?.[index].mappings.properties[element].fields
      ) {
        fieldsFromBackend.push({ label: element, type: 'string' });
      } else if (res?.[index].mappings.properties[element].type === 'keyword') {
        fieldsFromBackend.push({ label: element, type: 'string' });
      } else {
        fieldsFromBackend.push({
          label: element,
          type: res?.[index].mappings.properties[element].type,
        });
      }
      fieldList.push(element);
    }
    // }
  }
};

const parseForCatalog = (query: string) => {
  for (let i = 0; i < regexForCatalog.length; i++) {
    const groupArray = regexForCatalog[i].exec(query);
    if (groupArray) {
      const afterEqual = query.substring(query.indexOf('=') + 1);
      const noSpaces = afterEqual.replace(/\s/g, '');
      return noSpaces;
    }
  }
  return '';
};

const parseForNextSuggestion = (command: string) => {
  for (let i = 0; i < regexForPromSuggestion.length; i++) {
    const groupArray = regexForPromSuggestion[i].exec(command);
    if (groupArray) {
      return regexForPromSuggestion[i];
    }
  }
};

export const onPromItemSelect = async (
  { setQuery, item }: { setQuery: any; item: any },
  dslService: DSLService
) => {
  // DUMMY API
  const DUMMY_API = {
    fetchFields: (index: string) => {
      return {
        promQl: {
          mappings: {
            properties: {
              text_field: {
                type: 'text',
              },
              keyword_field: {
                type: 'keyword',
              },
              double_field: {
                type: 'double',
              },
            },
          },
        },
      };
    },
  };

  if (indicesFromBackend.length === 0 && catalogList.includes(item.itemName)) {
    currCatalog = item.itemName;
    getIndices(DUMMY_API);
  }

  if (fieldsFromBackend.length === 0 && indexList.includes(item.itemName)) {
    // currIndices = [item.itemName];
    currIndex = item.itemName;
    getFields(DUMMY_API);
  }

  setQuery(item.label + ' ');
};

export const parseGetPromSuggestions = async (
  base: string,
  currQuery: string,
  dslService: DSLService,
  possibleCommands: Array<{ label: string }> = pipeCommands
) => {
  const fullQuery = base ? base + '| ' + currQuery : currQuery;
  const splitSpaceQuery = fullQuery.split(' ');
  const splitPipeQuery = fullQuery.split('|');

  const lastWord = splitSpaceQuery[splitSpaceQuery.length - 1];
  const lastCommand = splitPipeQuery[splitPipeQuery.length - 1];
  const firstCommand = splitPipeQuery[0];

  // DUMMY API
  const DUMMY_API = {
    getListOfCatalogs: () => {
      return ['prometheus'];
    },
    getIndicesForCatalog: () => {
      return ['http_requests_total', 'http_requests_latency'];
    },
  };

  if (!base && isEmpty(catalogsFromBackend)) {
    await getCatalogs(DUMMY_API);
  }

  if (fullQuery.match(EMPTY_REGEX)) {
    return fillSuggestions(currQuery, lastWord, [{ label: 'source' }]);
  }

  const next = parseForNextSuggestion(lastCommand);
  if (next) {
    let cat;
    switch (next) {
      case EQUAL_AFTER_SOURCE:
        return fillSuggestions(currQuery, lastWord, [{ label: '=' }]);
      case CATALOG_AFTER_EQUAL:
        return fillSuggestions(currQuery, lastWord, catalogsFromBackend);
      case DOT_AFTER_CATALOG:
        cat = parseForCatalog(firstCommand);
        if (catalogList.includes(cat)) {
          currCatalog = cat;
          await getIndices(DUMMY_API);
          return filterSuggestions(
            [{ label: currQuery.trim() + '.', input: currQuery, suggestion: '.', itemName: '.' }],
            lastWord
          );
        } else {
          return [];
        }
      case METRIC_AFTER_DOT:
        return filterSuggestions(
          indicesFromBackend.map((index: IndexItem) => {
            return {
              label: currQuery.substring(0, currQuery.lastIndexOf(lastWord)).trim() + index.label,
              input: currQuery,
              suggestion: index.label.substring(lastWord.length),
              itemName: index.label,
            };
          }),
          lastWord
        );
      case PIPE_AFTER_METRIC:
        return fillSuggestions(currQuery, lastWord, [{ label: '|' }]);
    }
  }

  return [];
};
