import { Sider as RefineSider } from "@refinedev/mui";
import { useMenu } from "@refinedev/core";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
export const Sider = () => {
    const { menuItems } = useMenu();
    return (
        <RefineSider
            render={({ items, logout }) => {
                return (
                    <>
                        {menuItems.map((item, i) => (
                            <ListItem disablePadding>
                                <ListItemButton href={item.route}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText>{item.label}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        ))}
                        <ListItem disablePadding>
                            <ListItemButton href="custom">
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText>Custom</ListItemText>
                            </ListItemButton>
                        </ListItem>
                        {logout}
                    </>
                );
            }}
        />
    );
};
