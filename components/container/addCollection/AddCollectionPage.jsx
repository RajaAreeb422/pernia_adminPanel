import axios from 'axios';
import React, { memo } from 'react';
//import { response } from "express";

import { useState, useEffect } from 'react';
import { data } from '../../../data';
import './addcoupon.scss';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import router from 'next/router';
import { toast, ToastContainer } from 'react-nextjs-toast';
import Drop from './Drop';
import jwt_decode from "jwt-decode";

const AddCollectionPage = memo(props => {
  const [state, setState] = useState({
     name:'',
     brand_id:null,
     tag_id:null,
     category_id:null
   
  });

  const [selected, setSelected] = useState([]);
  const [brand, setBrand] = useState([]);
  const [tag, setTag] = useState([]);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [mydiv, setDiv] = useState(false);

  const {
    name,
    brand_id,
    tag_id,
    category_id


  } = state;
  const [modal, setModal] = React.useState(false);
  const toggle = () => setModal(!modal);
  const [servermodal, setServerModal] = React.useState(false);
  const servertoggle = () => setServerModal(!servermodal);
  const [errormodal, setErrorModal] = React.useState(false);
  const Errortoggle = () => setErrorModal(!errormodal);
  useEffect(() => {
    var decoded = jwt_decode(localStorage.getItem('token'));
  console.log('local',localStorage.getItem('token'))
   setState({...state,['brand_id']:decoded.result.supplier_id})
    axios
    .get('https://api.mazglobal.co.uk/maz-api/tag')
    .then(res => setTag(res.data.data))
    .catch(err => console.log(err));
    if(decoded.result.role_id==1)
    {
      axios
      .get(`https://api.mazglobal.co.uk/maz-api/categories`)
      .then(res => setCategories(res.data.data))
      .catch(err => console.log(err));
    }
    else{
      axios
      .get(`https://api.mazglobal.co.uk/maz-api/categories/getCategoriesBySupplierId/${decoded.result.supplier_id}`)
      .then(res => setCategories(res.data.data))
      .catch(err => console.log(err));
    }
   
  }, []);
  
  const submitHandler = e => {
    e.preventDefault();
    console.log("state",state);
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    };

    // if(state.coupon_code==''||state.coupon_type==''||state.coupon_description==''||state.expiry_date==''
    // ||state.discount_type==''|| state.discount_value==null || state.usage_limit_per_coupon==null ||state.usage_limit_per_user==null)
    if(state.name=='' || state.category_id=='' || state.category_id==null
    ||state.tag_id=='' ||state.tag_id==null  || selected.length==0)
    Errortoggle()
    else
    {
      let bb=parseInt(state.brand_id);
      let cc=parseInt(state.category_id);
      let tt=parseInt(state.tag_id);
      state.brand_id=bb;
      state.category_id=cc;
      state.tag_id=tt;
      
      axios
      .post(
        `https://api.mazglobal.co.uk/maz-api/collections`,
        state,
      ).then(response=>{

        var formData = new FormData();
        for (const key of Object.keys(selected)) {
          formData.append('imageFile', selected[key]);
          console.log('in lopppp', formData);
        }
        
        axios
          .post(
            `https://api.mazglobal.co.uk/maz-api/collections/uploadCollectionImage/${response.data.InsertedId}`,
            formData,
            config,
            {},
          )
          .then(res => {
            console.log(res.data);
            toggle()
            //succtoggle();
          })
      .catch(error => {
        servertoggle()
        console.log(error);
      });
    }).catch(err=>console.log(err))
        
    // axios
    // .post(
    //   `http://95.111.240.143:8080/ecom-api/coupons`,
    //   state,config,

    //   { headers: { 'content-type': 'application/json' } },
    // )

    // .then(response => {
    //   toggle()
      
    //   console.log("respoooos coupon",response);
    // })
    // .catch(error => {
    //   console.log('error',error)
    //   toast.notify(`Sorry! Coupon code is not unique..`,{
    //     type:'error'
    //   })
     
    // });

    }

  };

  const handleChange = names => e => {
   
    const name = e.target.name;
    console.log(name);
    let value = e.target.value;
    
    console.log(value);
    setState({
      ...state,
      [name]: value,
    });
  };

  const handleChild = childData => {
    setSelected({ ...childData });
    console.log('selected', selected);
   
  };
  const move = ()  => {
    router.push('/coupon/Coupon')
  }

  const PostCategory = () => (
    <div className="main">
      <div className="newCoupon">
      <ToastContainer align={"right"} position={"middle"}/>
        <div className='couponNav'>
        <h1 className="newCouponTitle">Add Collection</h1>
        <img  className='couponimg' src='https://freepngimg.com/thumb/gift/137009-vector-surprise-birthday-gift-png-free-photo.png'/>
        </div>  
        
        <form className="newCouponForm" onSubmit={submitHandler}>
          <div className="newCouponItem">
            <div style={{padding:'20px'}}>
              <label  style={{marginLeft:'0px'}}>Collection Name</label>
              <input
                type="text"
                style={{marginLeft:'0px',width:'300px'}}
                placeholder="name"
                className="form-control"
                name="name"
                value={state.name}
                onChange={handleChange('name')}
              />
            </div>
          
            {/* <div style={{padding:'20px',width:'400px'}}>
            <label style={{marginLeft:'60px'}}>Brand</label>
            <select
            className="form-control"
            id="parent"
            required
         
            name="brand_id"
            style={{marginBottom:'10px',width:'300px',marginLeft:'60px'}}
             onChange={handleChange('brand_id')}
            >
                {brand.map(it=>(
                    <option value={it.id}>{it.name}</option>
                ))

                }
            </select>
            </div> */}
             <div style={{padding:'20px',width:'400px'}}>
            <label style={{marginLeft:'0px'}}>Tag</label>
            <select
            className="form-control"
            id="parent"
            required
            name="tag_id"
            style={{marginBottom:'10px',width:'300px',marginLeft:'0px'}}
             onChange={handleChange('tag_id')}
            >
                {tag.map(it=>(
                    <option value={it.id}>{it.name}</option>
                ))

                }
               <option value={-1}>Other</option>
            </select>
            </div>
          </div>


          <div className="newCouponItem">
         
       
          <div style={{padding:'20px',width:'100%'}}>
            <label style={{marginLeft:'0px'}}>Category</label>
            <select
            className="form-control"
            id="parent"
            required
         
            name="category_id"
            style={{marginBottom:'10px',width:'300px',marginLeft:'0px'}}
             onChange={handleChange('category_id')}
            >
            {categories.map(it=>(
                    <option value={it.id}>{it.name}</option>
                ))

                }
            </select>
            </div>
          </div>

          <div className="newCouponItem1">
            <div style={{width:'700px',marginLeft:'20px'}}>
              <label>Image</label>
              <Drop parentCall={handleChild}/>
              {/* <textarea
                type="date"
                style={{height:'120px'}}
                value={state.coupon_description}
                placeholder="details....."
                name="coupon_description"
                onChange={handleChange('coupon_description')}
                className="form-control"
              /> */}
            </div>
          </div>
          
      
          <div className="newCouponItem">
            <button type="submit" className="newCouponButton">
              Add
            </button>
          </div>
        </form>
      </div>
      
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Alert</ModalHeader>
        <ModalBody>
          <>Collection Added Successfully</>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={move}>
            OK
          </Button>
          
        </ModalFooter>
      </Modal>

      <Modal isOpen={errormodal} toggle={Errortoggle}>
        <ModalHeader style={{color:'red'}} toggle={Errortoggle}>!Warning</ModalHeader>
        <ModalBody>
          <>Please provide All the Fields including Image</>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={Errortoggle}>
            OK
          </Button>
          
        </ModalFooter>
      </Modal>
      <Modal isOpen={servermodal} toggle={servertoggle}>
        <ModalHeader style={{color:'red'}} toggle={servertoggle}>!Warning</ModalHeader>
        <ModalBody>
          <>Sorry Something Went Wrong!</>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={servertoggle}>
            OK
          </Button>
          
        </ModalFooter>
      </Modal>
    </div>
  );

  return (
    <>
     
      {PostCategory()}
    </>
  );
});
export default AddCollectionPage;
