import React from "react";
import { useDataGrid, EditButton, ShowButton, List, MarkdownField, DateField } from "@refinedev/mui";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { useMany } from "@refinedev/core";
// import { useList } from "@refinedev/core";

export const BlogPostList = () => {
    // if we need to filter data we use the useList hook from refine core
    // const postUseListResult = useList({
    //     resource: "posts",
    //     sorters: [
    //         {
    //             field: "id",
    //             order: "desc",
    //         },
    //     ],
    //     filters: [
    //         {
    //             field: "id",
    //             operator: "contains",
    //             value: "21",
    //         },
    //     ],
    // });
    // console.log({ postUseListResult });

    const { dataGridProps } = useDataGrid();

    const { data: categoryData, isLoading: categoryIsLoading } = useMany({
        resource: "categories",
        ids: dataGridProps?.rows?.map((item: any) => item?.category?.id) ?? [],
        queryOptions: {
            enabled: !!dataGridProps?.rows,
        },
    });

    const columns = React.useMemo<GridColumns<any>>(
        () => [
            {
                field: "id",
                headerName: "Id",
                type: "number",
                minWidth: 50,
            },
            {
                field: "title",
                headerName: "Title",
                minWidth: 200,
            },
            {
                field: "content",
                headerName: "Content",
                minWidth: 250,
                renderCell: function render({ value }) {
                    return <MarkdownField value={(value ?? "").slice(0, 80) + "..."} />;
                },
            },
            {
                field: "category",
                headerName: "Category",
                valueGetter: ({ row }) => {
                    const value = row?.category?.id;

                    return value;
                },
                minWidth: 300,
                renderCell: function render({ value }) {
                    return categoryIsLoading ? <>Loading...</> : categoryData?.data?.find((item) => item.id === value)?.title;
                },
            },
            {
                field: "status",
                headerName: "Status",
                minWidth: 200,
            },
            {
                field: "createdAt",
                headerName: "Created At",
                minWidth: 250,
                renderCell: function render({ value }) {
                    return <DateField value={value} />;
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                renderCell: function render({ row }) {
                    return (
                        <>
                            <EditButton hideText recordItemId={row.id} />
                            <ShowButton hideText recordItemId={row.id} />
                        </>
                    );
                },
                align: "center",
                headerAlign: "center",
                minWidth: 80,
            },
        ],
        [categoryData?.data]
    );

    return (
        <List>
            <DataGrid {...dataGridProps} columns={columns} autoHeight />
        </List>
    );
};
