import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router';

import Downloads from '../Downloads';
import Uploads from '../Uploads';

const HistoryLayout = () => {
  return (
    <Fragment>
      <Switch>
        <Route exact path='/downloads'>
          <Downloads></Downloads>
        </Route>
        <Route exact path='/uploads'>
          <Uploads></Uploads>
        </Route>
      </Switch>
    </Fragment>
  );
};

export default HistoryLayout;
