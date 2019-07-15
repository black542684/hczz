<template>
  <div class="basestationcon">
    <div class="toptit"><span>基站管理</span></div>
    <div class="searchregion">
      <table style="width: 100%;">
        <tr>
          <td class="stasearlabel">类型</td>
          <td>
            <el-select style="width: 100%;border: none;" @change="stationTypeSelect" v-model="stationtype" placeholder="请选择">
              <el-option
                v-for="item in stationoption"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
          </td>
          <td class="stasearlabel">{{stationtype==0?'MNC':'SID'}}</td>
          <td>
            <el-select v-show="stationtype==0" style="width: 100%;" clearable v-model="mncselect" placeholder="请选择">
              <el-option
                v-for="item in MNCList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
              </el-option>
            </el-select>
            <input v-show="stationtype==1" style="width: 100%;height: 100%;" v-model="mncselect">
          </td>
          <td class="stasearlabel">{{stationtype==0?'LAC/TAC':'BID'}}</td>
          <td>
            <input type="text" v-model="AC" style="width: 100%;height: 100%;">
          </td>
          <td class="stasearlabel">{{stationtype==0?'CI':'NID'}}</td>
          <td>
            <input type="text" v-model="CI" style="width: 100%;height: 100%;">
          </td>
          <td class="oprbtn" colspan="5">
            <button class="searchbtn" @click="queryBaseStationList"><i class="icon iconfont icon-sousuo1"></i>查询</button>
          </td>
        </tr>
      </table>
    </div>
    <div class="operateregion">
      <div class="infonum">共为您找到<span class="numred">{{totalnum}}</span>条数据</div>
      <div class="operatebtnbox">
        <button class="opbtn">导出</button>
        <!--<button class="opbtn newbtn">新建+</button>-->
      </div>
    </div>
    <div class="basestationlist">
      <el-table v-loading="loading" :data="basestationdata" height="450" border style="width: 99.5%">
        <el-table-column type="index" label="编号" width="50"></el-table-column>
        <el-table-column prop="AC" :label="stationtype==0?'LAC/TAC':'BID'"></el-table-column>
        <el-table-column prop="CI" :label="stationtype==0?'CI':'NID'" text-align="center"></el-table-column>
        <el-table-column :label="stationtype==0?'MNC':'SID'" width="120">
          <template slot-scope="scope">
            <span>{{stationtype==0?scope.row.nettype:scope.row.SID}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Roads" label="靠近道路描述">
          <!--<template slot-scope="scope">-->
            <!--<div>{{scope.row.CALL_LIST_START}}-</div>-->
            <!--<div>{{scope.row.CALL_LIST_END}}</div>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column prop="Address" label="靠近地址描述"></el-table-column>
        <el-table-column prop="LOCAL_LINKMAN_NUM" label="经纬度">
          <template slot-scope="scope">
            <div>{{scope.row.Latb}}</div>
            <div>{{scope.row.Lngb}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="Radius" label="覆盖范围"></el-table-column>
        <el-table-column prop="Ver" label="版本日期"></el-table-column>
        <el-table-column prop="FOREIGN_LINKMAN_NUM" label="自动更新">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.auupdate" @change="autoUpdata(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="stationedit(scope.row)">编辑</el-button>
            <!--<el-button type="text">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
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

      <!--编辑弹框-->
      <div class="dialogbox">
        <!--编辑弹框-->
        <el-dialog title="编辑基站" width="50%" :visible.sync="stationeditdiagshow"  :modal-append-to-body='false'>
          <div class="diacontbox">
            <table style="width: 100%;border: 0 none;" class="distable">
              <tr>
                <td><span class="redstar">*</span>基站小区ID</td>
                <td class="">
                  <el-input disabled v-model="basestaid"></el-input>
                </td>
                <td class="labellen">基站类型</td>
                <td class="">
                  <el-input disabled v-model="MNCdata"></el-input>
                </td>
              </tr>
              <tr class="cutline">
                <td>靠近道路描述</td>
                <td class="" colspan="5">
                  <el-input v-model="roadinstruct"></el-input>
                </td>
              </tr>
              <tr>
                <td>靠近地址描述</td>
                <td class="" colspan="5">
                  <el-input v-model="addressinstruct"></el-input>
                </td>
              </tr>
              <tr>
                <td>经度</td>
                <td class="" style="padding-left:20px;">
                  <el-input v-model="jd"></el-input>
                </td>
                <td>纬度</td>
                <td class="" style="padding-left:20px;">
                  <el-input v-model="wd"></el-input>
                </td>
              </tr>
            </table>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveEdit">保存</el-button>
            <el-button type="primary" @click="stationeditdiagshow=false">取消</el-button>
          </div>
        </el-dialog>

      </div>
    </div>
  </div>
</template>

<script>
  import {searchBaseStationList,updateBaseStation,updateBaseStationByIdOrType} from "@/service/cdr"
  export default {
    name: "basestationmanage",
    data(){
      return {
        loading: true,
        basestationdata: [],//基站数据
        totalnum: 1,
        pagesize: 10,
        currentpage: 1,
        AC: '',
        CI: '',
        mncselect: '',
        stationeditdiagshow: false,
        basestaid: '',
        roadinstruct: '',//靠近道路描述
        addressinstruct: '',//靠近地址描述
        jd: '',
        wd: '',
        MNCList: [
          {
            id: 0,
            label: '移动'
          }, {
            id: 1,
            label: '联通'
          }, {
            id: 11,
            label: '电信'
          }
        ],
        MNCdata: '',
        basestationid: '',
        ifupdata: '',
        stationtype: 0,
        stationoption: [
          {
            id: 0,
            label: 'GSM/UMTS/LTE'
          }, {
            id: 1,
            label: 'CDMA'
          }
        ],


      }
    },
    methods: {
      //分页
      handleCurrentChange(currpage){
        this.currentpage = currpage;
        this.queryBaseStationList();
      },
      //类型切换
      stationTypeSelect(){
        this.mncselect = '';
        this.AC = '';
        this.CI = '';
        this.queryBaseStationList();
      },
      //基站管理查询列表
      queryBaseStationList(){
        const validate = this.validateCondation();
        if(!validate){
          return;
        }
        const params = {
          pageNum: this.currentpage,
          pageSize: this.pagesize,
          MNC: this.mncselect,
          AC: this.AC,
          CI: this.CI,
          searchType: this.stationtype,
        }
        this.loading = true;
        searchBaseStationList(params).then((res)=> {
          if(res){
            this.loading = false;
            this.basestationdata = res.dataList;
            this.totalnum = res.count;
            this.basestationdata.forEach((item)=>{
              if(item.MNC==0){
                item.nettype = '移动';
              }else if(item.MNC==1){
                item.nettype = '联通';
              }else if(item.MNC==11){
                item.nettype = '电信';
              }
              if(item.REF==99999999){
                item.auupdate = false;
              }else {
                item.auupdate = true;
              }
            })
          }

        }).catch((err)=> {
          console.log(err);
        });
      },
      //修改弹框显示
      stationedit(row){
        this.stationeditdiagshow = true;
        this.basestationid = row.ID;
        this.ifupdata = row.REF;
        if(row.REF==99999999){
          this.ifupdata = 0;
        }else {
          this.ifupdata = 1;
        }
        this.basestaid = row.CI;
        this.roadinstruct = row.Roads;//靠近道路描述
        this.addressinstruct = row.Address;//靠近地址描述
        this.jd = row.Lngb;
        this.wd = row.Latb;
        this.MNCdata = row.MNC
      },
      //修改保存按钮
      saveEdit(){//updateBaseStation
        const params = {
          id: this.basestationid,
          type: this.ifupdata,
          Address: this.addressinstruct,
          Roads: this.roadinstruct,
          Latb: this.wd,
          Lngb: this.jd,
        }
        updateBaseStation(params).then((res)=> {
          if(res.flag==1){
            this.$message({
              message: '修改成功',
              type: 'success'
            });
            this.stationeditdiagshow = false;
            this.queryBaseStationList();
          }else{
            this.$message({
              message: '修改失败',
              type: 'warning'
            });
          }
          this.stationeditdiagshow = false;
        }).catch((err)=> {
          console.log(err);
        });
      },
      //自动更新 updateBaseStationByIdOrType
      autoUpdata(row){
        const params = {
          ID: row.ID,
          type: row.auupdate==true?1:0,
        }
        updateBaseStationByIdOrType(params).then((res)=> {
          if(res.flag==0){
            this.$message({
              message: '更新成功',
              type: 'success'
            });
          }else{
            this.$message({
              message: '更新失败',
              type: 'warning'
            });
          }
        }).catch((err)=> {
          console.log(err);
        });
      },
      //校验查询条件
      validateCondation(){
        if(this.mncselect!=''){
          const mncreg = /^[0-9]*$/;
          const mncmessage = this.stationtype==0?'MNC必须为数字':'SID必须为数字';
          if(!mncreg.test(this.mncselect)){
            this.$message({
              message: mncmessage,
              type: 'warning'
            });
            return false;
          }
        }
        if(this.AC!=''){
          const acreg = /^[0-9]*$/;
          const acmessage = this.stationtype==0?'LAC/TAC必须为数字':'BID必须为数字';
          if(!acreg.test(this.AC)){
            this.$message({
              message: acmessage,
              type: 'warning'
            });
            return false;
          }
        }
        if(this.CI!=''){
          const cireg = /^[0-9]*$/;
          const cimessage = this.stationtype==0?'CI必须为数字':'NID必须为数字';
          if(!cireg.test(this.CI)){
            this.$message({
              message: cimessage,
              type: 'warning'
            });
            return false;
          }
        }
        return true;
      },
    },
    mounted(){
      this.queryBaseStationList();
    },
  }
</script>

<style scoped>
  @import '../../../static/css/cdr/cdranaly.css';
  .basestationcon {
    width: 100%;
    height: 100%;
    margin: 10px;
    border-radius: 5px;
  }
  .toptit {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background: linear-gradient(#42abe0, #428be6);
    border-radius: 5px;
    font-size: 14px;
    color: #ffffff;
    padding-left: 10px;
  }
  .searchregion {
    width: 100%;
    margin-top: 10px;
  }
  .searchregion table {
    margin-bottom: 0;
  }
  .searchregion table td {
    border: 1px solid #317bdc;
  }
  .stasearlabel {
    width: 100px;
    background: #c7edff;
    text-align: center;
  }
  .stasearlabel .oprbtn {
    text-align: right;
  }
  .searchregion .searchbtn {
    width: 80px;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    font-size: 14px;
    border: 1px solid #1a6db8;
    border-radius: 5px;
    background: linear-gradient(#42abe0, #428ce6);
  }
  .operateregion {
    width: 100%;
    height: 50px;
    line-height: 50px;
  }
  .infonum {
    float: left;
    font-size: 14px;
    padding-left: 10px;
  }
  .numred {
    color: red;
    margin-left: 3px;
    margin-right: 3px;
  }
  .operatebtnbox {
    float: right;
  }
  .opbtn {
    width: 80px;
    height: 30px;
    line-height: 30px;
    color: #ffffff;
    font-size: 14px;
    border: 1px solid #1a6db8;
    border-radius: 5px;
    background: linear-gradient(#42abe0, #428ce6);
  }
  .newbtn {
    margin-left: 20px;
    margin-right: 6px;
  }

</style>
