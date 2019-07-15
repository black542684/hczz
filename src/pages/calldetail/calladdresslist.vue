<template>
  <!--通讯录-->
  <div class="cdrcontainer">
    <div class="callhead">
      <span @click="backbtn" class="backbtn"><img src="../../assets2.0/hd-back.png" alt=""></span>
      <div class="thTitle">
        <span>机主：<span>{{rowownername}}-{{rowownercardid}}</span></span>
        <span class="ownerphone">机主号码：<span>{{ownerphone}}</span></span>
      </div>
    </div>
    <div class="conbox">
      <div class="con_left">
        <div class="search">
          <input style="width: 140px;height: 24px;border: 1px solid #7b8084;border-radius: 3px;" type="text"><button class="searchbtn">查询</button>
        </div>
        <div class="titletab">
          <span class="tit_bianhao">编号</span><span class="tit_phone">号码</span>
        </div>
        <div class="addresslist">
          <ul>
            <li v-for="(item,index) in contactslist" :key="item.phonenum" @click="currentContact(item.phonenum)">
              <div :class="{currenttabli: item.checked}"><span class="tit_bianhao">{{index+1}}</span><span class="tit_phone">{{item.phonenum}}</span></div>
            </li>
          </ul>
        </div>
        <!--分页-->
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            background
            :page-size="pagesize"
            :current-page="currentpage"
            layout="total, prev, pager, next"
            :total="totalnum">
          </el-pagination>
        </div>
      </div>
      <div class="con_right">
        <div class="contactbaseinfo">
          <table>
            <tr><td colspan="6"><span>号码：15602316932</span><button>修改</button></td><td rowspan="4">联系人头像</td></tr>
            <tr>
              <td class="tlabel">姓名</td>
              <td>王大利</td>
              <td class="tlabel">身份证</td>
              <td>372561200312010123</td>
              <td class="tlabel">现有话单</td>
              <td>2017-1-1-2017-12-31</td>
            </tr>
            <tr>
              <td class="tlabel">运营商</td>
              <td>北京移动</td>
              <td class="tlabel">通话次数</td>
              <td>15</td>
              <td class="tlabel">同身份号码</td>
              <td>2017-1-1-2017-12-31</td>
            </tr>
            <tr>
              <td class="tlabel">备注</td>
              <td>该号码可能与机主15623232121为同伙</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: "calladdresslist",
    data(){
      return {
        sjzuser: '',
        routerparams: {},
        ownerphone: '',//机主手机号
        rowownername: '',//机主姓名
        rowownercardid: '',//机主身份证号
        totalnum: 1,
        pagesize: 10,
        currentpage: 1,
        contactslist: [
          {
            phonenum: 15623452345
          },
          {
            phonenum: 15622222222
          },
          {
            phonenum: 15234523453
          },
          {
            phonenum: 15623545252
          },
          {
            phonenum: 13762622121
          },
          {
            phonenum: 18763632626
          }
        ],
      }
    },
    methods: {
      //返回主页面
      backbtn(){
        this.$router.push({name:'calllist'});
      },
      //联系人分页
      handleCurrentChange(currpage){
        this.currentpage = currpage;
      },
      //当前选中联系人
      currentContact(contact){
        // alert(1111);
        this.contactslist.forEach((item)=>{
          if(item.phonenum==contact){
            item.checked = true;
          }else {
            item.checked = false;
          }
        })
      },
    },
    mounted(){
      this.routerparams = this.$route.params;
      this.ownerphone = this.routerparams.PHONE;
      this.rowownername = this.routerparams.OWNER_NAME;
      this.rowownercardid = this.routerparams.OWNER_CARDID;

    },
  }
</script>

<style scoped>
  .cdrcontainer {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    background: #F2F7FC;
  }
  .callhead {
    width: 100%;
    height: 42px;
    line-height: 42px;
    border-radius: 5px;
    background: linear-gradient(#42abe0, #428de6);
    padding-left:8px;
    font-size:14px;
    color:#fff;
  }
  .backbtn{
    cursor: pointer;
    float:left;
    margin-top:7px;
  }
  .thTitle{
    padding-left:8px;
    float:left;
  }
  .ownerphone {
    margin-left: 10px;
  }
  .conbox {
    width: 100%;
    height: 92%;
    border: 1px solid #317bdc;
    border-radius: 5px;
    margin-top: 10px;
  }
  .conbox .con_left{
    height: 100%;
    width: 20%;
    float: left;
    border-right: 1px solid #317bdc;
  }
  .con_left .search {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #8fdbff;
    padding-left: 10px;
    border-bottom: 1px solid #317bdc;
  }
  .con_left .searchbtn {
    width: 58px;
    height: 24px;
    line-height: 24px;
    border: 1px solid #7b8084;
    border-left: 0 none;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(#ffffff, #d7d7d7);
  }
  .con_left .titletab {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #333333;
    border-bottom: 1px solid #317bdc;
  }
  .tit_bianhao {
    width: 20%;
    height: 100%;
    display: inline-block;
    text-align: center;
    border-right: 1px solid #317bdc;
  }
  .tit_phone {
    width: 50%;
    height: 100%;
    display: inline-block;
    text-align: center;
  }

  .addresslist {
    width: 100%;

  }
  .addresslist li{
    width: 100%;
    height: 35px;
    line-height: 35px;
    border-bottom: 1px solid #317bdc;
  }
  .addresslist .currenttabli {
    background: #548ed1;
    color: #ffffff;
  }

  /*右侧内容*/
  .con_right {
    width: 79%;
    height: 100%;
    float: left;
    margin-left: 10px;
    border-left: 1px solid #317bdc;
  }
  .contactbaseinfo table{
    margin: 0;
    width: 100%;
    /*border: 1px solid #317bdc;*/
  }
  .contactbaseinfo table td {
    border: 1px solid #317bdc;
  }

</style>
