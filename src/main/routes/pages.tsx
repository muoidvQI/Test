import { Suspense, lazy } from 'react';
import SuspenseLoader from 'src/presentation/components/SuspenseLoader';

//fallback khi tải lazy để import động
const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

const Overview = Loader(lazy(() => import('src/main/content/overview')));

// Dashboards

const Crypto = Loader(lazy(() => import('src/main/content/dashboards/Crypto')));

// Applications

const Messenger = Loader(
  lazy(() => import('src/main/content/applications/Messenger'))
);
const Transactions = Loader(
  lazy(() => import('src/main/content/applications/Transactions'))
);

const UserProfile = Loader(
  lazy(() => import('src/main/content/applications/Users/profile'))
);

const UserSettings = Loader(
  lazy(() => import('src/main/content/applications/Users/settings'))
);


const Buttons = Loader(
  lazy(() => import('src/main/content/pages/Components/Buttons'))
);
const Modals = Loader(
  lazy(() => import('src/main/content/pages/Components/Modals'))
);
const Accordions = Loader(
  lazy(() => import('src/main/content/pages/Components/Accordions'))
);
const Tabs = Loader(lazy(() => import('src/main/content/pages/Components/Tabs')));
const Badges = Loader(
  lazy(() => import('src/main/content/pages/Components/Badges'))
);
const Tooltips = Loader(
  lazy(() => import('src/main/content/pages/Components/Tooltips'))
);
const Avatars = Loader(
  lazy(() => import('src/main/content/pages/Components/Avatars'))
);
const Cards = Loader(lazy(() => import('src/main/content/pages/Components/Cards')));
const Forms = Loader(lazy(() => import('src/main/content/pages/Components/Forms')));

// Status

const Status404 = Loader(
  lazy(() => import('src/main/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/main/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/main/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/main/content/pages/Status/Maintenance'))
);

export {
   Overview, Crypto, Messenger, Transactions, UserProfile, UserSettings, Buttons, Modals,
   Accordions, Tabs, Badges, Avatars, Cards, Forms, Status404, Status500, StatusComingSoon, 
   StatusMaintenance, Tooltips 
  }