import { Refine } from "@refinedev/core";
import { ThemedLayout, ErrorComponent, RefineThemes, RefineSnackbarProvider, notificationProvider } from "@refinedev/mui";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import routerBindings, { NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { MuiInferencer } from "@refinedev/inferencer/mui";
import { BlogPostList, BlogPostEdit, BlogPostShow } from "./pages/blog-posts";
import { BlogPostCreate } from "pages/blog-posts/BlogPostCreate";

const App: React.FC = () => {
    return (
        <ThemeProvider theme={RefineThemes.Blue}>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
                <BrowserRouter>
                    <Refine
                        routerProvider={routerBindings}
                        dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
                        notificationProvider={notificationProvider}
                        resources={[
                            {
                                name: "blog_posts",
                                list: "/blog-posts",
                                show: "/blog-posts/show/:id",
                                create: "/blog-posts/create",
                                edit: "/blog-posts/edit/:id",
                            },
                        ]}
                        options={{
                            syncWithLocation: true,
                            warnWhenUnsavedChanges: true,
                        }}>
                        <Routes>
                            <Route
                                element={
                                    <ThemedLayout>
                                        <Outlet />
                                    </ThemedLayout>
                                }>
                                <Route index element={<NavigateToResource resource="blog_posts" />} />
                                <Route path="blog-posts">
                                    <Route index element={<BlogPostList />} />
                                    <Route path="show/:id" element={<BlogPostShow />} />
                                    <Route path="edit/:id" element={<BlogPostEdit />} />
                                    <Route path="create" element={<BlogPostCreate />} />
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
