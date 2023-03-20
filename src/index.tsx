import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';

import App from 'src/presentation/App';
import { SidebarProvider } from 'src/main/contexts/SidebarContext';

import {store} from "./main/store/index"
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={store}>
  <HelmetProvider>
    <SidebarProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SidebarProvider>
  </HelmetProvider>
  </Provider>
,
  document.getElementById('root')
);
