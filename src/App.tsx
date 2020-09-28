import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonRouterOutlet,
  IonIcon,
  IonTabs,
  IonTabBar,
  IonTabButton,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, home, calendar } from 'ionicons/icons';
import Churches from './pages/Churches';
import Ministers from './pages/Ministers';
import Agendas from './pages/Agendas';
import ChurchDetails from './pages/ChurchDetails';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

class App extends React.Component<any, any> {

  render() {
    return (
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path="/churches" component={Churches} exact={true} />
              <Route path="/churches/:id" component={ChurchDetails} />
              <Route path="/ministers" component={Ministers} exact={true} />
              <Route path="/agendas" component={Agendas} exact={true} />
              <Route path="/" render={() => <Redirect to="/churches"/>} exact={true} />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="churches" href="/churches">
                <IonIcon icon={home} />
              </IonTabButton>

              <IonTabButton tab="ministers" href="/ministers">
                <IonIcon icon={person} />
              </IonTabButton>

              <IonTabButton tab="agendas" href="/agendas">
                <IonIcon icon={calendar} />
              </IonTabButton>
            </IonTabBar>

          </IonTabs>
        </IonReactRouter>

      </IonApp>
    );
  }
}
export default App;