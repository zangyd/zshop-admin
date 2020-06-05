<template>
  <div class="login-container">
    <div class="login-border">
      <div class="login-main">
        <div class="login-logo">
          <img src="~@/assets/image/logo_100.png" alt="logo">
        </div>
        <loginBox/>
      </div>
    </div>
  </div>
</template>

<script>
import util from '@/utils/util'
import loginBox from './loginbox'

export default {
  name: 'login',
  components: {
    loginBox
  },
  data() {
    return {
      activeName: 'user'
    }
  },
  created() {
    util.cookies.set('block', 'false')
  }
}
</script>

<style lang="scss">
  .login-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100%;
    background-image: url('~@/assets/image/login.jpg');
    background-size: cover;
  }

  .login-info {
    padding-left: 60px;
  }

  .login-info-title {
    line-height: 90px;
  }

  .login-info-item {
    font-size: 14px;
  }

  .login-border {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 30px 55px 25px 55px;
    background-color: rgba(255, 255, 255, 0.12);
    border-radius: 6px;
  }

  .login-main {
    border-radius: 3px;
    box-sizing: border-box;
  }

  .login-main > h3 {
    margin-bottom: 20px;
  }

  .login-main > p {
    color: #76838F;
  }

  .login-logo {
    margin: 0 0 20px;
    text-align: center;
  }

  .login-submit {
    margin-top: 20px;
    width: 100%;
  }

  .login-form {
    margin: 10px 0;

    .el-form-item__content {
      width: 270px;
    }

    .el-form-item {
      margin-bottom: 15px;
    }

    .el-input {
      input {
        text-indent: 5px;
        border-color: #DCDCDC;
        border-radius: 3px;
      }

      .el-input__prefix {
        i {
          padding: 0 5px;
          font-size: 16px !important;
        }
      }
    }
  }

  .login-code {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-left: 10px;
  }

  .login-code-img {
    margin-top: 5px;
    width: 100px;
    height: 31px;
  }
</style>
