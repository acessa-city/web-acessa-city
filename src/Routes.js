import React, { useEffect, useState } from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Category as CategoryView,
  CityHallCreate as CityHallCreateView,
  MeuExemplo as MeuExemploBanana,
  DenunciationList as DenunciationView,
  CommentsList as CommentsView,
  CreateUser as CreateUserView,
  CommentsListCoordinator as CommentsCoordinatorView,
  DenunciationListCoordinator as DenunciationCoordinatorView,
  CategoryList as CategoryListView,
  AproveCityHallList as AproveCityHallListView,
  PrefecturesList as PrefecturesListView,
  CitizensList as CitizensListView,
  Profile as ProfileView,
  ModeratorCoordinatorList as ModeratorCoordinatorListView,
  ReportMap as ReportMapView,
  CreateReport as CreateReportView,
  HistoricReport as HistoricReportView,
  MainReportMap as MainReportMapView


} from './views';

import currentUser from 'utils/AppUser'


const Routes = () => {

  const [roles, setRoles] = useState({
    loaded: false,
    // admin: true
  });

  useEffect(() => {
    console.log(22);
    currentUser().then(user => {
      console.log('Routes: UserRoles::::', user.roles.includes('admin'))
      setRoles({
        ...roles,
        loaded: true,
        admin: user.roles.includes('admin'),
        coordinator: user.roles.includes('coordinator'),
        moderator: user.roles.includes('moderator'),
        city_hall: user.roles.includes('city_hall'),
        user: user.roles.includes('user')
      })
    })
      .catch(() => {
        console.log('erro::::')
        setRoles({
          ...roles,
          loaded: true
        })
      })
  }, [])


  if (roles.loaded) {
    return (

      <Switch>

        <Redirect
          exact
          from="/"
          to="/dashboard"
        />
        <RouteWithLayout
          component={CategoryView}
          exact
          layout={MainLayout}
          path="/category"
        />



        <RouteWithLayout
          component={ProductListView}
          exact
          layout={MainLayout}
          path="/products"
        />
        <RouteWithLayout
          component={TypographyView}
          exact
          layout={MainLayout}
          path="/typography"
        />
        <RouteWithLayout
          component={IconsView}
          exact
          layout={MainLayout}
          path="/icons"
        />

        <RouteWithLayout
          component={SettingsView}
          exact
          layout={MainLayout}
          path="/settings"
        />

        {/* Rotas da Prefeitura */}

        <RouteWithLayout
          component={ModeratorCoordinatorListView}
          exact
          layout={MainLayout}
          path="/gerenciar-usuarios"
          permission={roles.city_hall}
        />

        <RouteWithLayout
          component={ProfileView}
          exact
          layout={MainLayout}
          path="/profile"
          permission={roles.city_hall}
        />
        <RouteWithLayout
          component={CreateUserView}
          exact
          layout={MainLayout}
          path="/novo-usuario"
          permission={roles.city_hall}
        />
        {/* FIM Rotas da Prefeitura*/}




        {/* Rotas do Moderador */}

        <RouteWithLayout
          component={DenunciationView}
          exact
          layout={MainLayout}
          path="/denuncias-moderador"
          permission={roles.moderator}
        />

        <RouteWithLayout
          component={CommentsView}
          exact
          layout={MainLayout}
          path="/comentarios-moderador"
          permission={roles.moderator}
        />

        {/* FIM Rotas do Moderador */}




        {/* Rotas do Coordinator */}

        <RouteWithLayout
          component={DenunciationCoordinatorView}
          exact
          layout={MainLayout}
          path="/denuncias"
          permission={roles.coordinator}
        />

        <RouteWithLayout
          component={CommentsCoordinatorView}
          exact
          layout={MainLayout}
          path="/comentarios"
          permission={roles.coordinator}
        />
        <RouteWithLayout
          component={CategoryListView}
          exact
          layout={MainLayout}
          path="/categorias-subcategorias"
          permission={roles.coordinator}
        />
        {/* FIM Rotas do Coordinator */}


        {/* Rotas do Master */}

        {/* <RouteWithLayout
          component={AproveCityHallListView}
          exact
          layout={MainLayout}
          path="/aprovar-prefeitura"
          permission={true}
        /> */}

        <RouteWithLayout
          component={PrefecturesListView}
          exact
          layout={MainLayout}
          path="/prefeituras"
          permission={roles.admin}
        // permission={roles.admin || roles.moderator || roles.coordinator || roles.city_hall}
        />


        <RouteWithLayout
          component={CitizensListView}
          exact
          layout={MainLayout}
          path="/cidadaos"
          permission={roles.admin}
        // permission={roles.admin || roles.moderator || roles.coordinator || roles.city_hall}
        />
        {/* FIM Rotas do Master */}



        {/* ROTAS PARA TODOS */}

        <RouteWithLayout
          component={SignUpView}
          exact
          layout={MinimalLayout}
          path="/sign-up"
        />

        <Route
          component={SignInView}
          exact
          layout={MinimalLayout}
          path="/sign-in"
        />

        <RouteWithLayout
          component={DashboardView}
          exact
          layout={MainLayout}
          path="/dashboard"
          permission={true}
        />

        <RouteWithLayout
          component={AccountView}
          exact
          layout={MainLayout}
          path="/meu-perfil"
          permission={true}
        />
        <RouteWithLayout
          component={MeuExemploBanana}
          exact
          layout={MainLayout}
          path="/meu-exemplo"
          permission={true}
        />
        <RouteWithLayout
          component={ReportMapView}
          exact
          layout={MainLayout}
          path="/mapa-de-denuncias"
          permission={true}
        />
        <RouteWithLayout
          component={CreateReportView}
          exact
          layout={MainLayout}
          path="/criar-denuncia"
          permission={true}
        />
        <RouteWithLayout
          component={HistoricReportView}
          exact
          layout={MainLayout}
          path="/historico-de-denuncias"
          permission={true}
        />
        <RouteWithLayout
          component={MainReportMapView}
          exact
          layout={MainLayout}
          path="/mapa-principal"
          permission={true}
        />
        <Route
          component={NotFoundView}
          exact
          layout={MinimalLayout}
          path="/not-found"
        />

        <Redirect to="/not-found" />

        {/* FIM PARA TODOS */}


      </Switch>
    );
  }
  else {
    return <h1>carregando...</h1>
  }
};

export default Routes;
