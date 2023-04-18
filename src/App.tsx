import { Refine } from "@refinedev/core";
import { ThemedLayout, ErrorComponent, RefineThemes, RefineSnackbarProvider, notificationProvider } from "@refinedev/mui";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import routerBindings, { NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
// import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
// import { BlogPostList, BlogPostEdit, BlogPostShow } from "./pages/blog-posts";
// import { BlogPostCreate } from "pages/blog-posts/BlogPostCreate";
import { dataProvider } from "./data-provider";
import { MuiInferencer } from "@refinedev/inferencer/mui";
import Custom from "pages/custom/Custom";
import { Sider } from "./components/sider";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={RefineThemes.Blue}>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
                <BrowserRouter>
                    <Refine
                        dataProvider={dataProvider("https://fakestoreapi.com")}
                        routerProvider={{
                            ...routerBindings,
                            routes: [
                                {
                                    element: <Custom />,
                                    path: "/custom",
                                    layout: true,
                                },
                            ],
                        }}
                        notificationProvider={notificationProvider}
                        resources={[
                            {
                                name: "products",
                                list: "/products",
                                // show: "/blog-posts/show/:id",
                                // create: "/blog-posts/create",
                                // edit: "/blog-posts/edit/:id",
                            },
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}>
                        <Routes>
                            <Route
                                element={
                                    <ThemedLayout Sider={() => <Sider />}>
                                        <Outlet />
                                    </ThemedLayout>
                                }>
                                <Route path="custom">
                                    <Route index element={<Custom />} />
                                </Route>
                                <Route index element={<NavigateToResource resource="products" />} />
                                <Route path="products">
                                    <Route index element={<MuiInferencer />} />
                                    {/* <Route path="show/:id" element={<BlogPostShow />} />
                                    <Route path="edit/:id" element={<BlogPostEdit />} />
                                    <Route path="create" element={<BlogPostCreate />} /> */}
                                </Route>
                                <Route path="*" element={<ErrorComponent />} />
                            </Route>
                        </Routes>
                        <UnsavedChangesNotifier />
                    </Refine>
                </BrowserRouter>
            </RefineSnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
