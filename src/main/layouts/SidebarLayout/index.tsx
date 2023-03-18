import { FC, ReactNode } from 'react';
import { Box, alpha, lighten, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';

import config from "./../../env/index"
interface SidebarLayoutProps {
  children?: ReactNode;
}

console.log(process.env, config)
const SidebarLayout: FC<SidebarLayoutProps> = () => {
  const theme = useTheme();

  return (
    <>
        <Header />
        <Sidebar />

          <Box display="block">
            <Outlet />
        </Box>
    </>
  );
};

export default SidebarLayout;
