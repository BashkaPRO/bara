import React from 'react';
import {
  Link
} from 'react-router-dom';

import update from 'immutability-helper';

import {
  fetchLatlng
} from './business_form_util';
import {
  createBusiness,
  fetchBusiness,
  editBusiness,
  deleteBusiness,
} from '../../util/business_api_util';
import FormMap from './form_map';
import ErrorList from '../error_list';

export default class BusinessForm extends React.Component {
  constructor( props ) {
    super( props );
    this.formType = props.location.pathname.slice( -3 ) === 'new' ?
      'createBusiness' : 'editBusiness';
    this.state = {
      business: {
        name: '',
        address: ''
      },
      id: null,
      name: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      phone: '',
      url: '',
      price: '1',
      errors: [],
    };

    this.handleSubmit = this.handleSubmit.bind( this );
    this.handleDelete = this.handleDelete.bind( this );
    this.clearErrors = this.clearErrors.bind( this );
  }

  componentDidMount() {
    window.scrollTo( 0, 0 );
    if ( this.formType === 'editBusiness' ) {
      fetchBusiness( this.props.match.params.id )
        .then(
          business => {
            let {
              id,
              name,
              address,
              city,
              state,
              lat,
              lng,
              zipcode,
              phone,
              url,
              price,
            } = business;
            this.setState( {
              id,
              name,
              address,
              city,
              state,
              lat,
              lng,
              zipcode,
              phone,
              url,
              price,
            } );
          },
          errors => this.setState( {
            errors: errors.responseJSON
          } )
        );
    }
  }

  update( field ) {
    return e => this.setState( {
      [ field ]: e.currentTarget.value,
    } );
  }

  updateNested( field ) {
    return (
      e => {
        let {
          business
        } = this.state;
        const newBiz = update( business, {
          [ field ]: {
            $set: e.currentTarget.value
          }
        } );
        this.setState( {
          business: newBiz
        } );
      }
    );
  }


  handleSubmit( e ) {
    e.preventDefault();
    window.scrollTo( 0, 0 );
    let biz = this.state;
    fetchLatlng( biz )
      .then(
        response => {
          if ( response.status === 'OK' ) {
            let {
              lat,
              lng
            } = response.results[ 0 ].geometry.location;
            biz.lat = lat;
            biz.lng = lng;
            if ( this.formType === 'createBusiness' ) {
              createBusiness( biz )
                .then(
                  business =>
                  this.props.history.push( `/businesses/${business.id}` ),
                  errors => this.setState( {
                    errors: errors.responseJSON
                  } )
                );
            } else {
              editBusiness( biz )
                .then(
                  business =>
                  this.props.history.push( `/businesses/${business.id}` ),
                  errors => this.setState( {
                    errors: errors.responseJSON
                  } )
                );
            }
          } else {
            this.setState( {
              errors: [ 'Invalid Address' ]
            } );
          }
        }
      );
  }

  titleText() {
    return this.formType === 'createBusiness' ?
      <h2>Add a Business</h2> : <h2>Update Business Details</h2>;
  }

  submitText() {
    return this.formType === 'createBusiness' ?
      'Add Business' : 'Submit Changes';
  }

  handleDelete( e ) {
    e.preventDefault();
    deleteBusiness( this.props.match.params.id )
      .then( () => this.props.history.push( "/" ) );
  }

  deleteButton() {
    return this.formType === 'createBusiness' ?
      null :
      <div className='input-wrapper'>
          <button onClick={this.handleDelete} >Delete Business</button>
        </div>;
  }

  clearErrors() {
    this.setState( {
      errors: []
    } );
  }

  businessForm() {
    let {
      business
    } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="business-form">
        <label htmlFor='nested-name'>Nested Business Name</label>
        <div className='input-wrapper'>
          <input type="text"
            id="nested-name"
            value={business.name}
            onChange={this.updateNested('name')}
            className="login-input"
            placeholder="Mel's Diner"
          />
        </div>
        <label htmlFor='nested-address'>Nested Business address</label>
        <div className='input-wrapper'>
          <input type="text"
            id="nested-address"
            value={business.address}
            onChange={(e) => {

              const newBiz = update(business, {
                address: {$set: e.currentTarget.value}}
              );
              this.setState({business: newBiz});
            }}
            className="login-input"
            placeholder="Mel's Diner"
          />
        </div>
        <label htmlFor='nested-name'>Business Name</label>
        <div className='input-wrapper'>
          <input type="text"
            id="name"
            value={this.state.name}
            onChange={this.update('name')}
            className="login-input"
            placeholder="Mel's Diner"
          />
        </div>

        <label htmlFor='address'>Address</label>
        <div className='input-wrapper'>
          <input type="text"
            id="address"
            value={this.state.address}
            onChange={this.update('address')}
            className="login-input"
            placeholder="123 Main St"
          />
        </div>

        <label htmlFor='city'>City</label>
        <div className='input-wrapper'>
          <input type="text"
            id="city"
            value={this.state.city}
            onChange={this.update('city')}
            className="login-input"
            placeholder="New York"
          />
        </div>

        <label htmlFor='state'>State</label>
        <div className='input-wrapper'>
          <input type="text"
            id="state"
            value={this.state.state}
            onChange={this.update('state')}
            className="login-input"
            placeholder="NY"
          />
        </div>

        <label htmlFor='zipcode'>ZIP</label>
        <div className='input-wrapper'>
          <input type="number"
            id="zipcode"
            value={this.state.zipcode}
            onChange={this.update('zipcode')}
            className="login-input"
            placeholder="10001"
          />
        </div>

        <label htmlFor='phone'>Phone</label>
        <div className='input-wrapper'>
          <input id="phone"
            value={this.state.phone}
            onChange={this.update('phone')}
            className="login-input"
            placeholder="(555)555-5555"
          />
        </div>

        <label htmlFor='url'>Web Address</label>
        <div className='input-wrapper'>
          <input id="url"
            value={this.state.url}
            onChange={this.update('url')}
            className="login-input"
            placeholder="http://bara.com"
          />
        </div>

        <label htmlFor='price'>Price</label>
        <select className='input-wrapper'
          id="price" value={this.state.price}
          onChange={this.update('price')} >
          <option value='1' >$    Inexpensive</option>
          <option value='2' >$$   Moderate</option>
          <option value='3' >$$$  Pricey</option>
          <option value='4' >$$$$ Ultra High-End</option>
        </select>
        <br />

        <div className='input-wrapper'>
          <button type="submit" >{this.submitText()}</button>
        </div>
        {this.deleteButton()}
      </form>

    );
  }

  render() {
    let form = this.businessForm();
    let map = <FormMap lat={this.state.lat}
      lng={this.state.lng} formType={this.formType} />;
    if ( this.formType === 'editBusiness' && !this.state.id ) {
      form = null;
      map = null;
    }
    const goHome =
      <Link to="/" className='link-as-button'>
        Go Home
      </Link>;
    let cancel = goHome;
    if ( this.formType === 'editBusiness' ) {
      if ( this.state.id ) {
        let businessLink = `/businesses/${this.state.id}`;
        cancel =
          <Link to={businessLink} className='link-as-button'>
            Cancel
          </Link>;
      } else {
        cancel = goHome;
      }
    }

    return (
      <div className='center form-outer-wrapper'>
        <ErrorList errors={ this.state.errors }
          clearErrors={this.clearErrors} />
        {this.titleText()}
        <div className='form-inner-wrapper'>
          <div>
            {form}
            {cancel}
          </div>
          {map}
        </div>
      </div>
    );
  }
}
