/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export const getDataValueQuery = (index: string, field: string) => {
  const query = {
    index,
    size: 0,
    aggs: {
      top_tags: {
        terms: {
          field,
        },
      },
    },
  };
  return query;
};
