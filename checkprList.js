import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';


let productModal = null;
let delModal = null;


const app = createApp({

  data() {

    return {
      products: [],
      temp: {},
      apiurl: 'https://vue3-course-api.hexschool.io',
      path: 'kurokawa2021',
      states:false,
      tempProduct:{
        imagesUrl: [],
      }


    }

  },


  methods: {

    check() {

      axios.post(`${this.apiurl}/v2/api/user/check`)
        .then((res) => {
          console.log('認證成功');
          this.getlist();
        })
        .catch((err) => {
          console.log('認證失敗');
          window.location = 'index.html';

        })


    },
    out() {

      axios.post(`${this.apiurl}/v2/logout`)
        .then((res) => {

          console.log(res.data);
          //登出轉向
          window.location = 'index.html';

        })
        .catch((err) => {
          console.log(err);
        })


    }
    ,

    getlist() {



      // https://vue3-course-api.hexschool.io/v2/api/kurokawa2021/admin/products
      axios.get(`${this.apiurl}/v2/api/${this.path}/admin/products/all`)
        .then((res) => {

      

          this.products = res.data.products;


        })
        .catch((err) => {
          console.log(err)
        })
    },

    openModal(  isNew  , item  ){

      if ( isNew === 'add' ) {
        this.tempProduct = {
          imagesUrl: [],
        };
        
        this.states = true;
       productModal.show();
      }else if (  isNew === 'edit'  ){

        //淺拷貝
        this.tempProduct = { ...item };
       

        this.states = false;
        productModal.show();


      }else if ( isNew === 'del'  ) {

        this.tempProduct = { ...item };

       
        delModal.show();




      }
     
    },

    updataPr() {

      //新增

      if (this.states) {

        let url = `${ this.apiurl }/v2/api/${this.path}/admin/product`;
      
        axios.post( url ,  { data: this.tempProduct } )
        .then( (res) => {
        alert(res.data.message);
        productModal.hide();
  
        //更新渲染
        this.getlist();
        })
        .catch( ( er) => {
          alert(er.data.message);
        });
        
      }


      //修改

      if (!this.states) {

        let url = `${this.apiurl}/v2/api/${this.path}/admin/product/${this.tempProduct.id}` ;

      //  https://vue3-course-api.hexschool.io/v2/api/kurokawa2021/admin/product/-MuENTXmQ9YbvCmYgORh
      
        axios.put( url ,  { data: this.tempProduct }  )
        .then(  (res) => {

          alert(res.data.message);
          productModal.hide();
           //更新渲染
           this.getlist();
        } )
        .catch( (er) => {
          alert(er.data.message);
        })


      }

      



    
     
    },

    delPr(){

      //刪除產品
      // https://vue3-course-api.hexschool.io/v2/api/{api_path}/admin/product/{id}


      axios.delete(`${this.apiurl}/v2/api/${this.path}/admin/product/${this.tempProduct.id}`)
      .then( (res) => {

        alert(res.data.message);
        delModal.hide();

        //更新渲染
        this.getlist();



      } )
      .catch(  (er) => {
        console.log(er.data.messgae)
      } )

    },

    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },

   

  },


  mounted() {


  

     productModal = new bootstrap.Modal(  document.querySelector('#productModal') );
     
     delModal = new bootstrap.Modal(  document.querySelector('#delProductModal') );
 
    

    // 取token

    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common.Authorization = token;



    this.check();



  }


})

//掛載
app.mount('#app');


