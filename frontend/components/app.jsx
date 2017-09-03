import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
// header
import HeaderRouter from './header/header_router';
// forms
import BusinessFormContainer from './business_form/business_form_container';
import ReviewFormContainer from './review_form/review_form_container';
import SessionFormContainer from './session_form/session_form_container';
// business show, search, home pages
import BusinessShow from './business_show/business_show';
import Search from './search/search';
import Home from './home/home';
// 404
import FourZeroFour from './four_zero_four';
// footer
import Footer from './footer';

const App = () => (
  <div  className='page-container'>
    <HeaderRouter />
    <div className='body'>
      <Switch>
        <ProtectedRoute path="/businesses/new"
          component={BusinessFormContainer} />
        <ProtectedRoute path="/businesses/:id/edit"
          component={BusinessFormContainer} />
        <ProtectedRoute path="/businesses/:business_id/reviews/new"
          component={ReviewFormContainer} />
        <ProtectedRoute path="/reviews/:id/edit"
          component={ReviewFormContainer} />
        <AuthRoute path="/login" component={SessionFormContainer} />
        <AuthRoute path="/signup" component={SessionFormContainer} />
        <Route path='/businesses/:id' component={BusinessShow} />
        <Route path='/businesses' component={Search} />
        <Route exact path='/' component={Home} />
        <Route component={FourZeroFour} />
      </Switch>
    </div>
    <Footer />
  </div>
);

export default App;
