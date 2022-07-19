/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiPanel, EuiTitle, EuiSpacer, EuiHorizontalRule, EuiOverlayMask } from '@elastic/eui';
import React, { useState } from 'react';
import { getCustomModal } from '../../../../components/custom_panels/helpers/modal_containers';
import { PatternDetailFlyout } from './pattern_detail_flyout';
import { DocFlyout } from '../events_views/doc_flyout';
import { HttpSetup } from '../../../../../../../src/core/public';
import { PatternsTable } from './patterns_table';

interface PatternsTabProps {
  http: HttpSetup;
}

export interface TableDataType {
  firstTimestamp: number;
  lastTimestamp: number;
  puncSignature: string;
  patternName: string;
  ratio: string;
  count: string;
}

export function PatternsTab(props: PatternsTabProps) {
  const { http } = props;

  // Uncomment below to enable EuiComboBox
  // const [selectedOptions, setSelected] = useState<OptionType[]>([]);
  // const [options, setOptions] = useState<OptionType[]>(
  //   dummyTableData.map((td) => {
  //     return {
  //       label: td.puncSignature,
  //     };
  //   })
  // );
  // const onChange = (selected: any) => {
  //   setSelected(selected);
  // };

  // const onCreateOption = (
  //   searchValue: string,
  //   flattenedOptions: Array<EuiComboBoxOptionOption<unknown>> = []
  // ) => {
  //   const normalizedSearchValue = searchValue.trim().toLowerCase();

  //   if (!normalizedSearchValue) {
  //     return;
  //   }

  //   const newOption = {
  //     label: searchValue,
  //   };

  //   // Create the option if it doesn't exist.
  //   if (
  //     flattenedOptions.findIndex(
  //       (option: OptionType) => option.label.trim().toLowerCase() === normalizedSearchValue
  //     ) === -1
  //   ) {
  //     setOptions([...options, newOption]);
  //   }

  //   // Select the option.
  //   setSelected([...selectedOptions, newOption]);
  // };

  // Uncomment to enable Filters
  // const [filters, setFilters] = useState<FilterType[]>([]);

  const dummyTableData = [
    {
      firstTimestamp: Date.now(),
      lastTimestamp: Date.now(),
      puncSignature:
        '///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=///*-=',
      patternName: 'Punctuation-Signature-1',
      ratio: '4.06%',
      count: '461',
    },
    {
      firstTimestamp: Date.now(),
      lastTimestamp: Date.now(),
      puncSignature: '^/!//&^*-^=',
      patternName: 'Punctuation-Signature-2',
      ratio: '5.06%',
      count: '561',
    },
    {
      firstTimestamp: Date.now(),
      lastTimestamp: Date.now(),
      puncSignature: '^/""/&^*-^=',
      patternName: 'Punctuation-Signature-3',
      ratio: '6.06%',
      count: '661',
    },
    {
      firstTimestamp: Date.now(),
      lastTimestamp: Date.now(),
      puncSignature: '^#@//-()^=',
      patternName: 'Punctuation-Signature-4',
      ratio: '7.06%',
      count: '761',
    },
  ];

  const dummyDoc = {
    agent: 'Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1',
    bytes: '4531',
    clientip: '218.148.135.12',
    event: '{"dataset":"sample_web_logs"}',
    extension: 'gz',
    geo:
      '{"srcdest":"BR:ES","src":"BR","coordinates":{"lat":32.73355611,"lon":-117.1896567},"dest":"ES"}',
    host: 'artifacts.opensearch.org',
    index: 'opensearch_dashboards_sample_data_logs',
    ip: '218.148.135.12',
    machine: '{"os":"win 8","ram":11811160064}',
    memory: 'null',
    message:
      '218.148.135.12 - - [2018-07-22T04:18:12.345Z] "GET /beats/filebeat/filebeat-6.3.2-linux-x86_64.tar.gz_1 HTTP/1.1" 200 4531 "-" "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1"',
    phpmemory: 'null',
    referer: 'http://www.opensearch-opensearch-opensearch.com/success/gemini-6a',
    request: '/beats/filebeat/filebeat-6.3.2-linux-x86_64.tar.gz',
    response: '200',
    tags: 'warning',
    timestamp: '2022-06-26 04:18:12.345',
    url:
      'https://artifacts.opensearch.org/downloads/beats/filebeat/filebeat-6.3.2-linux-x86_64.tar.gz_1',
    utc_time: '2022-06-26 04:18:12.345',
  };

  const dummyTimeStampField = 'timestamp';

  const dummyExplorerFields = {
    availableFields: [
      { name: 'agent', type: 'string' },
      { name: 'bytes', type: 'long' },
      { name: 'clientip', type: 'ip' },
      { name: 'event', type: 'struct' },
      { name: 'extension', type: 'string' },
      { name: 'geo', type: 'struct' },
      { name: 'host', type: 'string' },
      { name: 'index', type: 'string' },
      { name: 'ip', type: 'ip' },
      { name: 'machine', type: 'struct' },
      { name: 'memory', type: 'double' },
      { name: 'phpmemory', type: 'long' },
      { name: 'referer', type: 'string' },
      { name: 'request', type: 'string' },
      { name: 'response', type: 'string' },
      { name: 'tags', type: 'string' },
      { name: 'timestamp', type: 'timestamp' },
      { name: 'url', type: 'string' },
      { name: 'utc_time', type: 'timestamp' },
    ],
    queriedFields: [],
    selectedFields: [{ name: 'message', type: 'string' }],
    unselectedFields: [
      { name: 'agent', type: 'string' },
      { name: 'bytes', type: 'long' },
      { name: 'clientip', type: 'ip' },
      { name: 'event', type: 'struct' },
      { name: 'extension', type: 'string' },
      { name: 'geo', type: 'struct' },
      { name: 'host', type: 'string' },
      { name: 'index', type: 'string' },
      { name: 'ip', type: 'ip' },
      { name: 'machine', type: 'struct' },
      { name: 'memory', type: 'double' },
      { name: 'message', type: 'string' },
      { name: 'phpmemory', type: 'long' },
      { name: 'referer', type: 'string' },
      { name: 'request', type: 'string' },
      { name: 'response', type: 'string' },
      { name: 'tags', type: 'string' },
      { name: 'timestamp', type: 'timestamp' },
      { name: 'url', type: 'string' },
      { name: 'utc_time', type: 'timestamp' },
    ],
  };

  const dummyRawQuery =
    "source = opensearch_dashboards_sample_data_logs | where match(request,'filebeat')";

  const emptyPattern = {
    firstTimestamp: 0,
    lastTimestamp: 0,
    puncSignature: '',
    patternName: '',
    ratio: '',
    count: '',
  };

  const [patternFlyoutOpen, setPatternFlyoutOpen] = useState<TableDataType>(emptyPattern);
  const [eventFlyoutOpen, setEventFlyoutOpen] = useState<boolean>(false);
  const [surroundingEventsOpen, setSurroundingEventsOpen] = useState<boolean>(false);
  const [openTraces, setOpenTraces] = useState<boolean>(false);
  const [flyoutToggleSize, setFlyoutToggleSize] = useState(false);
  const [modalLayout, setModalLayout] = useState(<EuiOverlayMask />);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const openPatternFlyout = (pattern: TableDataType) => {
    setPatternFlyoutOpen(pattern);
  };

  const closePatternFlyout = () => {
    setPatternFlyoutOpen(emptyPattern);
  };

  const openEventFlyout = () => {
    closePatternFlyout();
    setEventFlyoutOpen(true);
  };

  const onRename = async (newPatternName: string) => {
    closeModal();
  };

  const renamePattern = (existingName: string) => {
    setModalLayout(
      getCustomModal(
        onRename,
        closeModal,
        'Name',
        'Rename pattern',
        'Cancel',
        'Rename',
        existingName
      )
    );
    showModal();
  };

  return (
    <>
      <EuiPanel>
        <EuiTitle size="s">
          <h3>
            Punctuation Signatures
            <span className="panel-header-count"> ({dummyTableData.length})</span>
          </h3>
        </EuiTitle>
        <EuiSpacer size="xs" />
        {/* <Filters page="patterns" filters={filters} setFilters={setFilters} appConfigs={[]} /> */}
        {/* <EuiComboBox
        fullWidth={true}
        onChange={onChange}
        onCreateOption={onCreateOption}
        options={options}
        selectedOptions={selectedOptions}
      /> */}
        <EuiSpacer size="m" />
        <EuiHorizontalRule margin="none" />
        <PatternsTable
          tableData={dummyTableData}
          renamePattern={renamePattern}
          openPatternFlyout={openPatternFlyout}
        />
        {patternFlyoutOpen.puncSignature !== '' && (
          <PatternDetailFlyout
            pattern={patternFlyoutOpen}
            closeFlyout={closePatternFlyout}
            renamePattern={renamePattern}
            openEventFlyout={openEventFlyout}
          />
        )}
        {eventFlyoutOpen && (
          <DocFlyout
            http={http}
            detailsOpen={eventFlyoutOpen}
            setDetailsOpen={setEventFlyoutOpen}
            doc={dummyDoc}
            timeStampField={dummyTimeStampField}
            memorizedTds={[
              <td className="osdDocTableCell__dataField eui-textBreakAll eui-textBreakWord">
                {`218.148.135.12 - - [2018-07-22T04:18:12.345Z] "GET /beats/filebeat/filebeat-6.3.2-linux-x86_64.tar.gz_1 HTTP/1.1" 200 4531 "-" "Mozilla/5.0 (X11; Linux x86_64; rv:6.0a1) Gecko/20110421 Firefox/6.0a1"`}
              </td>,
            ]}
            explorerFields={dummyExplorerFields}
            openTraces={openTraces}
            rawQuery={dummyRawQuery}
            toggleSize={flyoutToggleSize}
            setToggleSize={setFlyoutToggleSize}
            setOpenTraces={setOpenTraces}
            setSurroundingEventsOpen={setSurroundingEventsOpen}
          />
        )}
      </EuiPanel>
      {isModalVisible && modalLayout}
    </>
  );
}