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
  regexForMetric,
  FIELD_AFTER_WHERE,
  EQUAL_AFTER_FIELD,
} from '../../../../common/constants/autocomplete';

let currCatalog = '';
let currMetric = '';
let currField = '';
let currFieldType = '';

const catalogList: string[] = [];
const metricList: string[] = [];
const fieldList: string[] = [];
const catalogsFromBackend: CatalogItem[] = [];
const metricsFromBackend: IndexItem[] = [];
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
    metricsFromBackend.length = 0;
    const catalog = currCatalog;
    const res = await DUMMY_API.getMetricsForCatalog(catalog);
    if (!res) {
      return;
    }
    for (let i = 0; i < res.length; i++) {
      metricsFromBackend.push({ label: res[i] });
      metricList.push(res[i]);
    }
  }
};

const getFields = async (DUMMY_API: any): Promise<void> => {
  if (!isEmpty(currMetric)) {
    fieldsFromBackend.length = 0;
    const metric = currMetric;
    const res = await DUMMY_API.fetchFields(metric);
    if (!res) {
      // continue;
      return;
    }
    const resFieldList = Object.keys(res?.[metric].mappings.properties);
    for (let j = 0; j < resFieldList.length; j++) {
      const element = resFieldList[j];
      if (
        res?.[metric].mappings.properties[element].properties ||
        res?.[metric].mappings.properties[element].fields
      ) {
        fieldsFromBackend.push({ label: element, type: 'string' });
      } else if (res?.[metric].mappings.properties[element].type === 'keyword') {
        fieldsFromBackend.push({ label: element, type: 'string' });
      } else {
        fieldsFromBackend.push({
          label: element,
          type: res?.[metric].mappings.properties[element].type,
        });
      }
      fieldList.push(element);
    }
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

const parseForMetric = (query: string) => {
  for (let i = 0; i < regexForMetric.length; i++) {
    const groupArray = regexForMetric[i].exec(query);
    if (groupArray) {
      const afterEqual = query.substring(query.indexOf('=') + 1);
      const noSpaces = afterEqual.replace(/\s/g, '');
      const afterDot = noSpaces.substring(query.indexOf('.') + 1);
      return afterDot;
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
        http_requests_total: {
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
        http_requests_latency: {
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

  if (metricsFromBackend.length === 0 && catalogList.includes(item.itemName)) {
    currCatalog = item.itemName;
    getIndices(DUMMY_API);
  }

  if (fieldsFromBackend.length === 0 && metricList.includes(item.itemName)) {
    currMetric = item.itemName;
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
    getMetricsForCatalog: () => {
      return ['http_requests_total', 'http_requests_latency'];
    },
    fetchFields: (index: string) => {
      return {
        http_requests_total: {
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
        http_requests_latency: {
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
          metricsFromBackend.map((index: IndexItem) => {
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
      case EMPTY_REGEX:
        currMetric = parseForMetric(firstCommand);
        await getFields(DUMMY_API);
        currField = '';
        currFieldType = '';
        return fillSuggestions(currQuery, lastWord, possibleCommands);
      case FIELD_AFTER_WHERE:
        return fillSuggestions(currQuery, lastWord, fieldsFromBackend);
      case EQUAL_AFTER_FIELD:
        return fillSuggestions(currQuery, lastWord, [{ label: '=' }]);
    }
  }

  return [];
};
