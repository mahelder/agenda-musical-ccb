import React from 'react';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItemGroup,
  IonItemDivider,
  IonLoading,
  IonSearchbar,
  IonButton,
  IonIcon,
  withIonLifeCycle
} from '@ionic/react';
import firebase from 'firebase';
import MinisterDetails from './MinisterDetails';
import { close } from 'ionicons/icons';
import { Plugins, Capacitor } from "@capacitor/core";

type State = {
  ministers: { [index: string]: any },
  ministersShown: { [index: string]: any },
  details: { [index: string]: any },
  actives: any[],
  loading: boolean,
  searchbar: null,
  open: boolean,
};
class Ministers extends React.Component<{}, State> {

  constructor(props: any) {
    super(props);
    this.state = {     
      ministers: {},
      ministersShown: {},
      details: {},
      actives: [],
      loading: true,
      searchbar: null,
      open: false,
    }
    this.closeMinisterDetails = this.closeMinisterDetails.bind(this);
  }

  ionViewWillEnter() {
    this.loadVolunteers();
  }

  loadVolunteers() {
    var ministers: {[k: string]: any} = {};
    firebase.database().ref('/lista-telefones/musica').on('value', (ref) => {
      ref.forEach((cargo: any) => {
        if (cargo.key !== "descricao" && cargo.key !== "order"){
          ministers[cargo.key] = {
            "descricao": cargo.val()["descricao"],
            "voluntarios": [],
            "order": cargo.val()["order"] ? parseInt(cargo.val()["order"]) : Number.MAX_SAFE_INTEGER
          };
          cargo.forEach((voluntary: any) => {
            if(voluntary.val() !== cargo.val()["descricao"] && voluntary.val() !== cargo.val()["order"]){
              ministers[cargo.key]["voluntarios"].push(voluntary);
            }
          });
        }
      });

      ministers = Object.fromEntries(
        Object.entries(ministers).sort(([,a],[,b]) => { 
          if (a.order > b.order) return 1;
          if (a.order < b.order) return -1;
          return a.descricao.localeCompare(b.descricao);
        })
      );

      this.setState({ ministers, ministersShown: ministers, loading: false });
    });
  }

  closeMinisterDetails() {
    this.setState({open: false});
  }

  setActives(cargo: string){
    let actives = this.state.actives;
    if (actives.includes(cargo)) {
      let index = actives.indexOf(cargo);
      if (index > -1) {
        actives.splice(index, 1);
      }
    } else {
      actives.push(cargo);
    }
    this.setState({ actives });
  }

  closeApp() {
    if (Capacitor.isNative) {
      Plugins.App.exitApp();
    }
  }

  createList() {
    let html = []
    let ministers = this.state.ministersShown;
    for (let key in ministers) {
      html.push(
        <IonItemGroup key={key}>
          <IonItemDivider onClick={() => this.setActives(key)}>
            <IonLabel>{ministers[key]["descricao"]}</IonLabel>
          </IonItemDivider>
          {this.createListItems(ministers[key]["voluntarios"], key)}
        </IonItemGroup>
      )
    }
    return html;
  }

  createListItems(voluntarios: any, key: string) {
    let html: any[] = [];
    let style = (!this.state.actives.includes(key)) ? {"display": 'None'} : {"display": 'inherit'};
    let _this = this;
    
    voluntarios.sort(function(a: any, b: any) {
      let orderA = a.val()["order"] ? parseInt(a.val()["order"]) : Number.MAX_SAFE_INTEGER;
      let orderB = b.val()["order"] ? parseInt(b.val()["order"])   : Number.MAX_SAFE_INTEGER;
      if (orderA > orderB) return 1;
      if (orderA < orderB) return -1;
      return a.val()["nome"].localeCompare(b.val()["nome"]);
    });
    
    voluntarios.forEach(function (x: any) {
      html.push(
        <IonItem key={x.key} style={style} onClick={() => _this.setState({open: true, details: x.val()})}>
          <IonLabel>{x.val()["nome"]}</IonLabel>
        </IonItem>
      )
    });
    return html;
  }

  search(input: any) {
    this.setState({ loading: true });
    let search = input.detail.value.toLowerCase();
    let ministers = this.state.ministers;
    for (let cargo in ministers){
      ministers[cargo]["voluntarios"] = ministers[cargo]["voluntarios"].filter((x: any) => x.val().nome.toLowerCase().includes(search))
    }
    this.setState({ ministersShown: ministers, loading: false });
  }

  render() {    
    return (      
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Lista Telefônica</IonTitle>
            <IonButton slot="end" fill="clear" onClick={() => this.closeApp()}>
              <IonIcon slot="icon-only" icon={close}></IonIcon>
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonLoading isOpen={this.state.loading}></IonLoading>
          <MinisterDetails open={this.state.open} details={this.state.details} close={this.closeMinisterDetails}/>
          <IonSearchbar placeholder="Busque por nome" onIonChange={(e) => this.search(e)}></IonSearchbar>
          
          <IonList>
            {this.createList()}            
          </IonList>

        </IonContent>
      </IonPage>
    );
  }
};

export default withIonLifeCycle(Ministers);