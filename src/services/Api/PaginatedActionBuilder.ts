import { Page } from '../../types/Page';
import { ActionBuilder, HasToString, Method } from './ActionBuilder';

export class PaginatedActionBuilder extends ActionBuilder {

    private _page?: Page;

    constructor(method: Method, url: string) {
        super(method, url);
    }

    public page(page?: Page) {
        this._page = page;
        return this;
    }

    protected getQueryParams() {
        return PaginatedActionBuilder.mergeQueryAndPagination(
            super.getQueryParams(),
            this.getPage()
        );
    }

    protected getPage() {
        return this._page;
    }

    private static mergeQueryAndPagination(queryParams?: Record<string, HasToString>, page?: Page) {
        if (!page) {
            page = Page.defaultPage();
        }

        if (!queryParams) {
            queryParams = {};
        }

        queryParams.offset = (page.index - 1) * page.size;
        queryParams.limit = page.size;

        if (page.filter) {
            for (const filterElement of page.filter.elements) {
                queryParams[`filter[${filterElement.column}]`] = filterElement.value;
                queryParams[`filter:op[${filterElement.column}]`] = filterElement.operator;
            }
        }

        if (page.sort) {
            queryParams.sortColumn = page.sort.column;
            queryParams.sortDirection = page.sort.direction;
        }

        return queryParams;
    };

}

export const paginatedActionBuilder = (method: Method, url: string): PaginatedActionBuilder => {
    return new PaginatedActionBuilder(method, url);
};
