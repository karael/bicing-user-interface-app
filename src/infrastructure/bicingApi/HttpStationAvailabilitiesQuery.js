import ByIntervalInPeriodFilter from 'application/state/filter/ByIntervalInPeriodFilter';
import { OK } from 'http-status';

import HttpStationQueryError from 'infrastructure/bicingApi/errors/HttpStationQueryError';
import httpClient from 'infrastructure/bicingApi/httpClient';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

class HttpStationAvailabilitiesQuery {
  static async find(stationId, byFilter) {
    const apiResponse = await httpClient
      .get(HttpStationAvailabilitiesQuery.uri(stationId, byFilter))
      .then(response => response)
      .catch((error) => {
        throw HttpStationQueryError.withRequestError(error);
      });

    if (OK !== apiResponse.status) {
      throw HttpStationQueryError.withUnexpectedResponseStatus(apiResponse.status);
    }

    return apiResponse.data;
  }

  static uri(stationId, byFilter) {
    const uri = `/stations/${stationId}/availabilities`;

    if (byFilter instanceof ByIntervalInPeriodFilter) {
      const periodStart = byFilter.periodStartAt.format(DATE_TIME_FORMAT);
      const periodEnd = byFilter.periodEndAt.format(DATE_TIME_FORMAT);

      return `${uri}?periodStart=${periodStart}&periodEnd=${periodEnd}&interval=${byFilter.interval}`;
    }

    return uri;
  }
}

export default HttpStationAvailabilitiesQuery;
