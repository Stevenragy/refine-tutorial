import axios from "axios";
import { CrudFilters, CrudSorting, DataProvider, HttpError, Pagination } from "@refinedev/core";
import { stringify } from "query-string";
import { mapOperator } from "@refinedev/simple-rest";
import { IDataContextProvider, MetaQuery } from "@refinedev/core/dist/interfaces";

// Error handling with axios interceptors
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message,
            statusCode: error.response?.status,
        };

        return Promise.reject(customError);
    }
);

const generateFilters = (filters?: CrudFilters) => {
    const queryFilters: { [key: string]: string } = {};

    filters?.map((filter): void => {
        if ("field" in filter) {
            const { field, operator, value } = filter;
            const mappedOperator = mapOperator(operator);
            queryFilters[`${field}${mappedOperator}`] = value;
        }
    });

    return queryFilters;
};

export const dataProvider = (apiUrl: string): DataProvider => ({
    getList: async ({
        resource,
        pagination,
        sorters,
        filters,
    }: {
        resource: string;
        pagination?: Pagination;
        sorters?: CrudSorting;
        filters?: CrudFilters;
        meta?: MetaQuery;
        dataProviderName?: string;
    }) => {
        const url = `${apiUrl}/${resource}`;
        const { current = 1, pageSize = 10 } = pagination ?? {};

        const query: {
            _sort: string;
            _order: string;
            _start?: number;
            _end?: number;
        } = {
            _start: (current - 1) * pageSize,
            _end: current * pageSize,
            _sort: "",
            _order: "",
        };

        if (sorters && sorters.length > 0) {
            query._sort = sorters[0].field;
            query._order = sorters[0].order;
        }
        const queryFilters = generateFilters(filters);
        const { data, headers } = await axiosInstance.get(`${url}?${stringify(query)}&${stringify(queryFilters)}`);

        const total = +headers["x-total-count"];

        return {
            data,
            total,
        };
    },

    create: async ({ resource, variables, meta }) => {
        const url = `${apiUrl}/${resource}`;

        const { data } = await axiosInstance.post(url, variables);

        return {
            data,
        };
    },
    update: async ({ resource, id, variables, meta }) => {
        // You can handle the request according to your API requirements.

        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.patch(url, variables);

        return {
            data,
        };
    },
    deleteOne: async ({ resource, id, variables, meta }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.delete(url, {
            data: variables,
        });

        return {
            data,
        };
    },
    getOne: async ({ resource, id, meta }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { data } = await axiosInstance.get(url);

        return {
            data,
        };
    },
    getApiUrl: () => apiUrl,
});
