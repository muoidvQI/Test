import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import PageTitleWrapper from 'src/presentation/components/PageTitleWrapper';
import { Grid, Container } from '@mui/material';
import Footer from 'src/presentation/components/Footer';

import RecentOrders from './RecentOrders';

import { createSelector } from '@reduxjs/toolkit'
import {increment } from '../../../store/reducers'
import { useAppSelector, useAppDispatch } from './../../../store/hooks'
 
function ApplicationsTransactions() {

  // Lấy ra state
   const counterSelect = (state) =>  state.counter.value;
   // Lấy ra state sau filter
   const customSelector = createSelector(counterSelect, (counter)=> {
      return counter;
  }); 

  const dispatch = useAppDispatch();
  dispatch(increment())

  console.log(useAppSelector(counterSelect))

  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <RecentOrders />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default ApplicationsTransactions;
