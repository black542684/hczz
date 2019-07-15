<template>
  <div class="cdrcontainer">
    <div class="callhead">
      <!--<span class="callheadname">话单分析</span>-->
      <h3>话单研判</h3>
      <!--话单列表操作区域-->
      <div class="callopr">

        <ul>
          <li class="liBtn" @click="exportCallShow">
            <!-- <i class="icon iconfont icon-daoru"></i> -->
            <span >导入话单</span>
          </li>
          <li class="liBtn" @click="exportCall('1','all')" v-show="!isDisable">
            <!-- <i class="icon iconfont icon-daochu1"></i> -->
            <span>导出话单</span>
          </li>
          <li class="liBtn" v-show="isDisable">
            <!-- <i class="icon iconfont icon-daochu1"></i> -->
            <span>导出话单</span>
          </li>
         


          <li @click="partnerShipShow">
            <!-- <i class="icon iconfont icon-pengzhuang"></i> -->
            <span>同伙碰撞</span>
          </li>
          <li @click="mutualShow">
            <!-- <i class="icon iconfont icon-tonghuajilu"></i> -->
            <span>相互通话</span>
          </li>
          <li class="downpar btndown" :class="{currentborder: newnumdownshow}">
            <div @click="newNumDown">
              <!-- <i class="icon iconfont icon-fenxiyanpan"></i> -->
              <span>新号分析</span>
              <i class="icon iconfont iconup1 newdown"></i>
            </div>
            <div v-show="newnumdownshow" class="downcon">
              <p
                class="analyse"
                v-for="analyse in analysetype"
                :key="analyse.id"
                :class="{curranalyse:analyse.currentstatus}"
                @click="newNumAnalyse(analyse,'add')"
              >{{analyse.name}}</p>
            </div>
          </li>
          <li class="downpar" :class="{currentborder: disappearnumdownshow}">
            <div @click="disappearNumDown">
              <!-- <i class="icon iconfont icon-fenxi"></i> -->
              <span>消失号分析</span>
              <i class="icon iconfont iconup1 newdown"></i>
            </div>

            <div v-show="disappearnumdownshow" class="downcon">
              <p
                class="analyse"
                v-for="analyse in analysetype"
                :key="analyse.id"
                :class="{curranalyse:analyse.currentstatus}"
                @click="newNumAnalyse(analyse,'lost')"
              >{{analyse.name}}</p>
            </div>
          </li>
          <!--basestationtrail-->
          
          <li @click="linkBaseStationTrail">
            <!-- <i class="icon iconfont icon-zonghezhenduan"></i> -->
            <span>时空轨迹</span>
          </li>
         <!-- <div class="hrdiv"></div> -->
           <li @click="linkToCallfiledconfig" v-show='callconfig'>
            <!-- <i class="icon iconfont icon-daoru"></i> -->
            <span>话单配置</span>
          </li>
          <li @click="linkToImportManage"  v-show='exportbnt'>
            <!-- <i class="icon iconfont icon-daoru"></i> -->
            <span>导入配置</span>
          </li>
        </ul>
      </div>
    </div>
    <!--列表展示-->
    <div class="calllist">
      <!--搜索区域-->
      <table class="searchtlist">
        <tr>
          <td class="labelbgc">
            <span class="inpname">机主姓名</span>
          </td>
          <td class>
            <input class="optInput nameInput" type="text" v-model="ownername">
          </td>
          <td class="labelbgc">
            <span class="inpname">机主身份证</span>
          </td>
          <td class>
            <input class="optInput idCardInput" type="text" v-model="ownercardid">
          </td>
          <td class="labelbgc">
            <span class="inpname">本机号码</span>
          </td>
          <td class>
            <input class="optInput phoneInput" type="text" v-model="ownerphone">
          </td>
           <td class="labelbgc">
            <span class="inpname">机主地区</span>
          </td>
          <td class>
            <input class="optInput addressInput" type="text" v-model="ownerAddress">
          </td>
          <td class="labelbgc">起始时间</td>
          <td class="timetd iviewtime">
            <el-date-picker
              class="starttime"
              v-model="starttime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <span class="starttoendtime">至</span>
            <el-date-picker
              class="starttime"
              v-model="endtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </td>
          <td style="width: 60px;">
            <button class="callsearchbtn" @click="queryCallList">搜索</button>
          </td>
        </tr>
      </table>

      <el-table
        :data="calllistdata"
        height="400"
        @selection-change="callListSelectChange"
        style="width: 100%"
      >
        <el-table-column type="selection" min-width="5%"></el-table-column>
        <el-table-column label="本机机主" min-width="10%" text-align="center">
          <template slot-scope="scope">
            <div class="rowspecial">
              <a class="linkstyle" href="javascript:;">{{scope.row.OWNER_NAME}}</a>
            </div>
            <div class="rowspecial">
              <a class="linkstyle" href="javascript:;">{{scope.row.OWNER_CARDID}}</a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="PHONE" label="本机号码" min-width="10%">
          <template slot-scope="scope">
            <div>{{scope.row.PHONE}}</div>
            <div>({{scope.row.PHONE_ADDRESS}})</div>
          </template>
        </el-table-column>
        <el-table-column prop="amount1" sortable label="话单类型" min-width="10%">
          <template slot-scope="scope">
            <img
              class="phoneimg"
              v-if="scope.row.PHONE_TYPE=='中国移动'"
              src="../../assets/images/mobile.png"
              alt
            >
            <img
              class="phoneimg"
              v-if="scope.row.PHONE_TYPE=='中国联通'"
              src="../../assets/images/unicom.png"
              alt
            >
            <img
              class="phoneimg"
              v-if="scope.row.PHONE_TYPE=='中国电信'"
              src="../../assets/images/telecommunications.png"
              alt
            >
            <span>{{scope.row.PHONE_TYPE}}</span>
          </template>
        </el-table-column>
        <el-table-column label="话单周期" min-width="13%">
          <template slot-scope="scope">
            <div>{{scope.row.CALL_LIST_START}}-</div>
            <div>{{scope.row.CALL_LIST_END}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="LINKMAN_NUM" sortable label="联系人总数" min-width="10%"></el-table-column>
        <el-table-column prop="LOCAL_LINKMAN_NUM" sortable label="本地联系人" min-width="10%"></el-table-column>
        <el-table-column prop="FOREIGN_LINKMAN_NUM" sortable label="外地联系人" min-width="10%"></el-table-column>
        <el-table-column label="操作" min-width="22%">
          <template slot-scope="scope">
            <!--<el-button type="text" @click="seeAddressList(scope.row)">查看联系人</el-button>-->
            <el-button type="text" @click="linkCallDetail(scope.row)">话单详情</el-button>
            <el-button type="text" @click="linkStatistics(scope.row)">统计</el-button>
            <el-button type="text" @click="exportCallDataShow(scope.row)">导入</el-button>
            <el-button type="text" @click="exportCall(scope.row.ID,'row')" v-show="!isDisable">导出</el-button>
            <el-button type="text" v-show="isDisable">导出</el-button>
            <el-button type="text" @click="delCurrentCall(scope.row.ID)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page="currentpage"
          layout="prev, pager, next, jumper"
          :total="totalnum"
        ></el-pagination>
      </div>
    </div>
    <!--导出时隐藏的form表单-->
    <div style="display: none;">
      <form
        id="exportsubmit"
        method="POST"
        accept-charset="UTF-8"
        :action="httpUrl+'callListAanlysis/queryCallListForExport'"
      >
        <input type="text" id="callidList" name="callidList">
        <input type="text" id="templateId" name="templateId">
      </form>
    </div>

    <div class="dialogbox">
      <!--导入弹框-->
      <el-dialog title="导入话单" width="50%" :visible.sync="exportshow" :modal-append-to-body="false">
        <div class="diacontbox" v-show="!thirdsetshow">
          <table class="distable" v-show="firstshow">
            <tr>
              <td class="labelexp">
                <span class="redstar">*</span>手机号:
              </td>
              <td class>
                <el-input :disabled="importifedit" v-model="phonenumber"></el-input>
              </td>
              <td class="labelexp">机主姓名:</td>
              <td class>
                <el-input :disabled="importifedit" v-model="callingname"></el-input>
              </td>
            </tr>
            <tr class="cutline">
              <td class="labelexp">身份证号:</td>
              <td class>
                <el-input :disabled="importifedit" v-model="identitycard"></el-input>
              </td>
              <td class="labelexp">所在地:</td>
              <td class>
                <el-input :disabled="importifedit" v-model="calladdress"></el-input>
              </td>
            </tr>
            <tr>
              <td class="labelexp">
                <span class="redstar">*</span>话单类型:
              </td>
              <td class colspan="5" style="padding-left:20px;">
                <el-radio-group
                  :disabled="importifedit"
                  v-model="listtype"
                  @change="callTypeChange"
                >
                  <el-radio label="中国移动">
                    <img class="phoneimg" src="../../assets/images/mobile.png">中国移动
                  </el-radio>
                  <el-radio label="中国联通">
                    <img class="phoneimg" src="../../assets/images/unicom.png">中国联通
                  </el-radio>
                  <el-radio label="中国电信">
                    <img class="phoneimg" src="../../assets/images/telecommunications.png">中国电信
                  </el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr v-show="callyearshow">
              <td class="labelexp">话单年份:</td>
              <td>
                <el-date-picker
                  :disabled="importifedit"
                  v-model="callyear"
                  type="year"
                  value-format="yyyy"
                ></el-date-picker>
              </td>
            </tr>
            <tr>
              <td class="labelexp">上传附件:</td>
              <td class colspan="5">
                <p style="display: inline-block;position: relative;">
                  <el-form class="upload_file clearFix" enctype="multipart/form-data" method="post">
                    <!--<div class="updatebtn newupdatebtn" @click="updatebtnclick">选择文件</div>-->
                    <input class="upload_file_input" type="file" name="file" id="file">
                    <br>
                  </el-form>
                </p>
              </td>
            </tr>
            <tr>
              <td class="labelexp">
                <span v-show="sjzuser!='admin'" class="redstar">*</span>选择配置文件:
              </td>
              <td class colspan="5">
                <el-select
                  :disabled="importifedit"
                  v-model="configfile"
                  clearable
                  @change="configFileChange"
                  style="width: 100%;"
                  placeholder="请选择配置文件..."
                >
                  <el-option
                    v-for="item in configfilelist"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </td>
            </tr>
          </table>
          <div class="next" v-show="exportnextshow">
            <span class="settitline" href="javascript:;">设置第{{tabletitnum}}行为标题行</span>
            <div class="callfilebox">
              <div style="height: 245px;" v-html="callfile"></div>
            </div>
          </div>
        </div>
        <div class="thirdstep fctab" v-show="thirdsetshow">
          <div class="configuretit clearFix">
            <span class="settit">配置文件</span>
            <ul style="height: 88%;overflow-y: auto;">
              <li
                class="setli"
                v-for="(item, index) in modelList"
                @click="configTab(item.id)"
                :key="item.id"
              >
                <input type="text" :class="{currentconfig: item.checked}" v-model="item.name">
              </li>
            </ul>
          </div>
          <div class="setcon">
            <div class="setconlist">
              <div style="font-weight: 700">
                <span
                  style="display:inline-block;width: 120px;text-align: right;margin-bottom: 8px;"
                >系统对应字段</span>
                <span style="text-align: center;display: inline-block;width: 46%;">话单上传字段</span>
              </div>
              <div
                class="fileddistance"
                v-for="(item,index) in tabletitlist"
                v-if="index<filedspreadcon"
                :key="item.columncode"
              >
                <label
                  style="display:inline-block;width: 120px;text-align: right;margin-bottom: 8px;"
                >
                  <span v-if="index<5" class="redstar">*</span>
                  {{item.columnname}}
                </label>
                <el-select
                  size="small"
                  v-model="item.excelname"
                  :disabled="item.ifdisabled"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="option in tabletithang"
                    :key="option.excelname"
                    :label="option.excelname"
                    :value="option.excelname"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="filedspread">
              <button v-show="filedspreadbtnshow" class="filedspbtn" @click="filedSpreadList">
                展开
                <i class="icon iconfont icon-zhankai2" style="font-size: 12px;"></i>
              </button>
              <button v-show="!filedspreadbtnshow" class="filedspbtn" @click="filedRetractList">
                收起
                <i class="icon iconfont icon-shouqi" style="font-size: 12px;"></i>
              </button>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button
            v-show="firstshow && !finishbtnshow"
            id="callupfile"
            @click="exportSave"
            :disabled="isImportDisabled"
            type="primary"
          >下一步</el-button> -->
          <!-- v-show="firstshow && finishbtnshow" -->
          <el-button

            id="callupfilefinish"
            @click="importFirstFinish('first')"
            type="primary"
          >完成</el-button>
          <el-button v-if="exportnextshow" @click="setTitHang" type="primary">下一步</el-button>
          <button v-show="thirdsetshow" class="callbtn" @click="saveCurrentConfig">保存当前配置</button>
          <el-button
            v-show="thirdsetshow"
            id="endfinish"
            @click="endImportConfigFinish"
            :disabled="isImportDisabled"
            type="primary"
          >完 成</el-button>
        </div>
      </el-dialog>
    </div>
    <div>
      <!--同伙碰撞弹框-->
      <el-dialog title="同伙碰撞" width="40%" :visible.sync="partnershow" :modal-append-to-body="false">
        <div class="diacontbox">
          <div class="diatime">
            <el-date-picker
              class="starttime"
              v-model="starttime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <span class>至</span>
            <el-date-picker
              class="starttime"
              v-model="endtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <div>
            <span>
              至少与
              <input class="diaginp" v-model="commoncontact" type="text"> 个话单有通话联系
            </span>
            <p class="instructext">说明：请选择要分析的话单起始时间，设定有共同通话联系的话单数量（≥2），系统将自动找出在多个话单中的共同通话目标</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="partnerFinish" type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <!--相互通话弹框-->
      <el-dialog
        title="相互通话"
        width="40%"
        :visible.sync="mutualcallshow"
        :modal-append-to-body="false"
      >
        <div class="diacontbox">
          <div class="diatime">
            <el-date-picker
              class="starttime"
              v-model="starttime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <span class>至</span>
            <el-date-picker
              class="starttime"
              v-model="endtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <p class="instructext">说明：请选择相互分析的话单起始时间，系统讲自动碰撞所选择的的多个话单，找出话单机主的相互通话</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="mutualCallFinish" type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <!--新号分析弹框-->
      <el-dialog
        :title="callnumtit"
        width="40%"
        :visible.sync="callnumshow"
        :modal-append-to-body="false"
      >
        <div class="diacontbox">
          <div class="diatime">
            <el-date-picker
              class="starttime"
              v-model="starttime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <span class>至</span>
            <el-date-picker
              class="starttime"
              v-model="endtime"
              type="datetime"
              :editable="false"
              placeholder="选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <div>
            <span v-show="ifmany">
              至少
              <input class="diaginp" v-model="commoncontact" type="text"> 共同联系人,
            </span>
            <span>
              联系次数>=
              <input class="diaginp" v-model="contactnum" type="text">次
            </span>
            <!--新号分析单人-->
            <p
              class="instructext"
              v-if="callnumtit=='新增号码' && ifmany==false"
            >说明：请选择新号出现分析的起始时间，设定与机主的联系次数（≥1）,系统将自动比对之前时间的话单，找出新增号码</p>
            <!--新号分析多人-->
            <p
              class="instructext"
              v-if="callnumtit=='新增号码' && ifmany==true"
            >说明：请选择新号出现分析的起始时间，设定与机主的联系次数（≥1）, 同时满足有共同通话联系的话单数量（≥2），系统将自动比对之前时间的话单，找出在多个话单中的共同通话新增号码</p>
            <!--消失号分析单人-->
            <p
              class="instructext"
              v-if="callnumtit=='消失号码' && ifmany==false"
            >说明：请选择消失号出现分析的起始时间，设定与机主的联系次数（≥1）,系统将自动比对之之后时间的话单，找出消失号码</p>
            <!--消失号分析多人-->
            <p
              class="instructext"
              v-if="callnumtit=='消失号码' && ifmany==true"
            >说明：请选择消失号出现分析的起始时间，设定与机主的联系次数（≥1）, 同时满足有共同通话联系的话单数量（≥2），系统将自动比对之后时间的话单，找出在多个话单中的共同通话消失号码</p>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="analyseFinish" type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <!--消失号分析弹框-->
    </div>
  </div>
</template>

<script>
import { calluploadfile } from "@/service/calluploadfile"; // 渲染上传的数据
import { calluploadfilefinish } from "@/service/calluploadfilefinish"; // 渲染上传的数据
import {
  searchCallList,
  reloadFile,
  getSingleConfigList,
  saveTemplet,
  checkSingleTemplate,
  checkSingleTemplateList,
  saveSingleConfig,
  getSingleConfigDetailListByConfigId,
  checkTemplateFieldPoolList,
  deleteCallListById,
  getPermission
} from "@/service/cdr"; // 查询话单列表

const confighttpurl = window.g.apiUrl;

export default {
  name: "calllist",
  data() {
    return {
      httpUrl: confighttpurl, // 服务
      userinfo: {}, // 缓存中的用户登陆信息
      sjzuser: "", // 当前登陆用户
      isDisable: false,
      isImportDisabled: false,
      templateid: "",
      pagesize: 10,
      currentpage: 1,
      totalnum: 1,
      // ------start 导入弹框数据
      exportshow: false, // 导入话单弹框展示
      firstshow: true,
      exportnextshow: false,
      thirdsetshow: false,
      // 搜索区域字段
      ownername: "", // 机主姓名
      ownercardid: "", // 机主身份证
      ownerphone: "", // 机主手机
      ownerAddress: "", // 机主地区
      callID: "", // 话单id
      callingname: "", // 主叫姓名
      identitycard: "", // 身份证号
      phonenumber: "", // 手机号
      calladdress: "", // 机主所在地
      listtype: "", // 话单类型
      callfile: "", // 上传文件列表
      configfile: "", // 选择配置文件
      configfilelist: [],
      finishbtnshow: false, // 导入第一步完成按钮的显示
      importifedit: false, // 导入框内数据是否可修改
      configid: "",
      configname: "",
      // ------end 导入弹框数据
      newnumdownshow: false, // 新号分析下拉展示
      disappearnumdownshow: false, // 消失号分析下拉展示
      analysetype: [
        {
          id: "1",
          name: "单人分析",
          currentstatus: false
        },
        {
          id: "2",
          name: "多人分析",
          currentstatus: false
        }
      ],
      currentanalyse: false,
      starttime: "",
      endtime: "",
      commoncontact: 2, // 共同联系人
      contactnum: 1, // 联系次数
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      calllistdata: [],
      modelList: [],
      tabIndex: 0,
      setlist: [
        {
          ifedit: false,
          templateName: "Tab 2",
          id: "2",
          statue: "",
          content: "Tab 2 content"
        },
        {
          ifedit: false,
          templateName: "通用模板3",
          id: "3",
          statue: "",
          content: "Tab 3 content"
        }
      ],
      filedlist: [
        {
          id: "2",
          label: "时间类型"
        },
        {
          id: "3",
          label: "时长类型"
        },
        {
          id: "4",
          label: "通话类型"
        }
      ],

      partnershow: false, // 同伙碰撞弹框显示

      mutualcallshow: false, // 相互通话弹框显示

      callnumshow: false, // 号码分析弹框显示
      callnumtit: "", // 号码弹框标题
      ifmany: false,
      tabletitnum: -1, // 设置标题行
      tabletitlist: [],
      tabletitlisttemp: [],
      selectcalldata: [], // 话单选中数据列表
      callyear: "", // 话单年份，只有移动有
      callyearshow: false, // 选择中国移动时显示话单年份
      tabletithang: [],
      currentconfigmod: "",
      filedspreadcon: 6,
      filedspreadbtnshow: true,
      exportbnt:false,
      callconfig:false
    };
  },
  methods: {
    //获取权限
    
    // 话单字段配置按钮
    linkToCallfiledconfig() {
      this.$router.push({ name: "callfiledconfig" });
      
    },
    // 导入管理按钮
    linkToImportManage() {
      this.$router.push({ name: "importManage" });
    },
    // 相互通话
    mutualcall() {
      this.$router.push({ name: "callMutual" });
    },
    // 同伙碰撞
    toThpz() {
      this.$router.push({ name: "callConfederateCollision" });
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentpage = val;
      this.queryCallList();
    },
    // 导入话单展示
    exportCallShow() {
      if (this.sjzuser !== "admin") {
        this.finishbtnshow = true;
      } else {
        this.finishbtnshow = false;
      }
      this.importifedit = false;
      this.exportshow = true;
      this.firstshow = true;

      this.exportnextshow = false;
      this.thirdsetshow = false;
      this.callyearshow = false;
      this.callID = "1";

      // 清空数据
      this.phonenumber = ""; // 机主号
      this.callingname = ""; // 机主名称
      this.identitycard = ""; // 机主身份证号
      this.calladdress = "";
      this.listtype = ""; // 类型
      this.configfile = ""; // 配置文件id
      this.configid = "";
      // 弹框加载完毕再获取弹框内元素
      this.$nextTick(()=>{
        document.getElementById("file").value = "";
      })

    },
    // 列表数据的导入
    exportCallDataShow(row) {
      this.importifedit = true;
      this.exportshow = true;
      this.firstshow = true;
      this.exportnextshow = false;
      this.thirdsetshow = false;
      // 回显数据
      this.callID = row.ID;
      this.phonenumber = row.PHONE; // 机主号
      this.callingname = row.OWNER_NAME; // 机主名称
      this.identitycard = row.OWNER_CARDID; // 机主身份证号
      this.calladdress = row.PHONE_ADDRESS;
      this.listtype = row.PHONE_TYPE; // 类型
      if (this.listtype === "中国电信") {
        this.callyearshow = false;
      } else {
        this.callyearshow = true;
      }
      if (row.configid && row.configid !== "") {
        this.finishbtnshow = true;
        this.firstshow = true;
        this.configfile = row.configid; // 配置文件id
        this.configid = row.configid;
      } else {
        this.configid = "";
      }
      document.getElementById("file").value = "";
    },
    // 新号分析下拉
    newNumDown() {
      this.newnumdownshow = !this.newnumdownshow;
      this.disappearnumdownshow = false;
      this.analysetype.forEach(item => {
        item.currentstatus = false;
      });
    },
    // 消失号分析下拉
    disappearNumDown() {
      this.disappearnumdownshow = !this.disappearnumdownshow;
      this.newnumdownshow = false;
      this.analysetype.forEach(item => {
        item.currentstatus = false;
      });
    },
    newNumAnalyse(analyse, type) {
      // 校验是否选中数据
      if (analyse.id == "1") {
        if (!this.selectcalldata.length == 1) {
          this.$message({
            message: "单人分析请选择一条数据",
            type: "warning"
          });
          return;
        }
        if (this.selectcalldata.length > 1) {
          this.$message({
            message: "单人分析只能选择一条数据",
            type: "warning"
          });
          return;
        }
        this.ifmany = false;
      } else if (analyse.id == "2") {
        if (!(this.selectcalldata.length >= 2)) {
          this.$message({
            message: "多人分析请至少选择2条数据",
            type: "warning"
          });
          return;
        }
        this.ifmany = true;
      }
      this.callnumshow = true;
      if (type == "add") {
        this.callnumtit = "新增号码"; // 新增号码弹框标题
      } else if (type == "lost") {
        this.callnumtit = "消失号码"; // 新增号码弹框标题
      }
      this.analysetype.forEach(item => {
        if (item.id == analyse.id) {
          item.currentstatus = true;
        } else {
          item.currentstatus = false;
        }
      });
    },

    isPoneAvailable($poneInput) {
      var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (!myreg.test($poneInput)) {
        return false;
      } else {
        return true;
      }
    },
    // 导入弹框下一步按钮
    exportSave() {
      const that = this;
      // 校验手机号必填
      if (!this.phonenumber || this.phonenumber == "") {
        this.$message({
          message: "手机号为必填",
          type: "warning"
        });
        return;
      }
      const phonenumvalid = this.isPoneAvailable(this.phonenumber);
      if (phonenumvalid !== true) {
        this.$message({
          message: "请填写正确的手机号格式",
          type: "warning"
        });
        return;
      }
      if (!this.listtype || this.listtype == "") {
        this.$message({
          message: "请选择话单类型",
          type: "warning"
        });
        return;
      }

      const filevalue = document.getElementById("file").value;
      if (filevalue) {
        console.log(this.httpUrl);
        this.callfile = calluploadfile(
          "#callupfile",
          "file",
          this.httpUrl
        ).table;
      } else {
        this.$message({
          message: "请选择文件",
          type: "warning"
        });
        return;
      }

      this.firstshow = false;
      this.exportnextshow = true;
      this.$nextTick(() => {
        $(".callfilebox input").click(function() {
          that.tabletitnum = $(this).attr("value") - 0;
          var tabletits = $(this)
            .parent()
            .parent()
            .children("td");
          var tabletitnames = [];
          that.tabletithang = [];
          tabletits.each(function() {
            if ($(this).text() != "") {
              that.tabletithang.push({
                excelname: $(this).text()
              });
            }
          });
        });
      });
      this.modelList = this.modelList.filter(item => {
        return item.id.charAt(item.id.length - 1) != "N";
      });
    },
    // 设置标题行下一步
    setTitHang() {
      // this.$nextTick(()=>{
      //   this.tabletitlist = JSON.parse(sessionStorage.getItem('tabletitnames'));
      // })
      // this.queryCallConfigList();
      if (this.tabletitnum == -1) {
        this.$message({
          message: "请设置标题行",
          type: "warning"
        });
        return;
      }
      this.queryFiledList();
      this.modelList.push({
        ifedit: true,
        title: "New Tab",
        id: this.modelList.length + 1 + "N",
        isnew: true,
        modelstatus: true,
        checked: true,
        name: "新建配置" + (this.modelList.length + 1)
      });
      this.firstshow = false;
      this.exportnextshow = false;
      this.thirdsetshow = true;
    },
    // 跳转到话单详情
    linkCallDetail(val) {
      this.$router.push({ name: "callrowdetail", params: val });
    },

    // 导入选择配置文件改变
    configFileChange(configid) {
      if (configid) {
        this.finishbtnshow = true;
      } else {
        this.finishbtnshow = false;
      }
      let obj = {};
      obj = this.configfilelist.find(item => {
        return item.id === configid;
      });
      this.configid = configid;
      this.configname = obj.name;
    },
    /*---------------start弹框--------------------- */
    // 同伙碰撞弹框显示
    partnerShipShow() {
      if (!(this.selectcalldata.length >= 2)) {
        this.$message({
          message: "请至少选择2条数据",
          type: "warning"
        });
        return;
      }
      this.partnershow = true;
    },
    // 同伙碰撞完成按钮
    partnerFinish() {
      if (!this.starttime || this.starttime == "" || this.endtime == "") {
        this.$message({
          message: "日期不能为空",
          type: "warning"
        });
        return;
      }
      if (!this.commoncontact) {
        this.$message({
          message: "共同联系人不能为空",
          type: "warning"
        });
        return;
      }
      if (this.commoncontact - 0 < 2) {
        this.$message({
          message: "共同联系人不能少于2个",
          type: "warning"
        });
        return;
      }
      const params = {
        ownerphone: this.selectcalldata,
        starttime: this.starttime,
        endtime: this.endtime,
        commoncontact: this.commoncontact
      };
      // 跳转到同伙碰撞详情页
      this.$router.push({ name: "callConfederateCollision", params: params });
      this.partnershow = false;
    },

    // 相互通话弹框显示
    mutualShow() {
      if (!(this.selectcalldata.length >= 2)) {
        this.$message({
          message: "请至少选择2条数据",
          type: "warning"
        });
        return;
      }
      this.mutualcallshow = true;
    },
    // 相互通话完成按钮
    mutualCallFinish() {
      if (!this.starttime || this.starttime == "" || this.endtime == "") {
        this.$message({
          message: "日期不能为空",
          type: "warning"
        });
        return;
      }
      const params = {
        ownerphone: this.selectcalldata,
        starttime: this.starttime,
        endtime: this.endtime
      };
      // 跳转相互通话详情页 callMutual
      this.$router.push({ name: "callMutual", params: params });
      this.mutualcallshow = false;
    },

    // 新号分析
    analyseFinish() {
      if (!this.starttime || this.starttime == "" || this.endtime == "") {
        this.$message({
          message: "日期不能为空",
          type: "warning"
        });
        return;
      }
      if (this.ifmany == true) {
        if (!this.commoncontact) {
          this.$message({
            message: "联系人不能为空",
            type: "warning"
          });
          return;
        }
        if (this.commoncontact - 0 < 2) {
          this.$message({
            message: "至少有两个共同联系人",
            type: "warning"
          });
          return;
        }
      }
      if (!this.contactnum) {
        this.$message({
          message: "联系次数不能为空",
          type: "warning"
        });
        return;
      }
      if (this.contactnum - 0 < 1) {
        this.$message({
          message: "联系次数至少为1次",
          type: "warning"
        });
        return;
      }
      const params = {
        ownerinfo: this.selectcalldata,
        starttime: this.starttime,
        endtime: this.endtime,
        commoncontact: this.commoncontact, // 共同联系人
        contactnum: this.contactnum // 联系次数
      };

      if (this.callnumtit == "新增号码") {
        if (this.ifmany == true) {
          this.$router.push({ name: "moreAnalysis", params: params });
        } else if (this.ifmany == false) {
          this.$router.push({ name: "oneAnalysis", params: params });
        }
      } else if (this.callnumtit == "消失号码") {
        if (this.ifmany == true) {
          this.$router.push({ name: "lostMoreAnalysis", params: params });
        } else if (this.ifmany == false) {
          this.$router.push({ name: "lostOneAnalysis", params: params });
        }
      }
    },
    // 话单类型切换
    callTypeChange(val) {
      if (val == "中国电信") {
        this.callyearshow = false;
        this.callyear = "";
      } else {
        this.callyearshow = true;
        this.callyear = new Date().getFullYear() + "";
      }
    },

    /*---------------end弹框--------------------- */

    // 获取话单列表
    queryCallList() {
      if((this.starttime && !this.endtime) || (!this.starttime && this.endtime)){
        this.$message({
          type:'warning',
          message:'时间需两个都选或都为空！'
        });
        return;
      }
      const params = {
        userid: this.sjzuser,
        pageSize: this.pagesize, // 每页条数
        pageNum: this.currentpage, // 当前页
        name: this.ownername, // 机主姓名
        idCard: this.ownercardid, // 机主身份证号
        phone: this.ownerphone, // 本机号码
        phoneAddress: '', // 电话归属地
        startTime: this.starttime, // 开始时间
        endTime: this.endtime // 结束时间
      };
      // debugger

      searchCallList(params)
        .then(res => {
          console.log(this.calllistdata, "ffsgfdgdffdgfgfdsg");
          this.calllistdata = res.resultData;
          if (this.calllistdata) {
            this.calllistdata.forEach(item => {
              item.callperiod = item.CALL_LIST_START + "-" + item.CALL_LIST_END; //话单周期
            });
          }
          this.totalnum = res.count;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 话单选中
    callListSelectChange(selection) {
      this.selectcalldata = selection;
    },

    // 获取配置文件列表 getSingleConfigList
    queryCallConfigList() {
      let params = {
        searchtime: ",",
        searchtype: "",
        searchword: "",
        searchstatus: "1",
        pageSize:0,
        pageNo:0
      };
      getSingleConfigList({ jsonStr: JSON.stringify(params) })
        .then(res => {
          this.configfilelist = res.list;
          this.modelList = res.list;
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 导入选择配置文件完成
    importFirstFinish() {
      // 校验手机号必填
      if (!this.phonenumber || this.phonenumber == "") {
        this.$message({
          message: "手机号为必填",
          type: "warning"
        });
        return;
      }
      const phonenumvalid = this.isPoneAvailable(this.phonenumber);
      if (phonenumvalid !== true) {
        this.$message({
          message: "请填写正确的手机号格式",
          type: "warning"
        });
        return;
      }
      if (!this.listtype || this.listtype == "") {
        this.$message({
          message: "请选择话单类型",
          type: "warning"
        });
        return;
      }

      if (!this.configid || this.configid == "") {
        this.$message({
          message: "请选择配置文件",
          type: "warning"
        });
        return;
      }

      this.isImportDisabled = true;
      const params = {
        userid: this.sjzuser,
        callid: this.callID,
        phone: this.phonenumber, // 机主号
        owername: this.callingname, // 机主名称
        idcard: this.identitycard, // 机主身份证号
        phoneAddress: this.calladdress,
        phonetype: this.listtype, // 类型
        templetFile: "", // 文件
        configid: this.configid, // 配置文件id
        year: this.callyear
      };
      setTimeout(() => {
        this.isImportDisabled = false;
      }, 3000);
      let resultend = calluploadfilefinish("#callupfilefinish", "file", params, this.httpUrl);
      console.log(resultend.flag);
      if (resultend.flag) {
        this.$message({
          message: resultend.msg,
          type: "success"
        });
        this.queryCallList();
        this.exportshow = false;
      } else {
        this.$message.error(resultend.msg);
        return;
      }
    },
    // 最后一步完成
    endImportConfigFinish() {
      var configflag = true;
      this.tabletitlist.forEach(item => {
        if (
          item.columnname == "对端号码" ||
          item.columnname == "呼叫时间" ||
          item.columnname == "对话时长" ||
          item.columnname == "基站小区号" ||
          item.columnname == "主被叫"
        ) {
          if (!item.excelname || item.excelname == "") {
            configflag = false;
          }
        }
      });
      if (!configflag) {
        this.$message({
          message: "对端号码,呼叫时间,对话时长,基站小区号,主被叫为必选字段",
          type: "warning"
        });
        return;
      }
      this.isImportDisabled = true;
      this.tabletitlist = this.tabletitlist.filter(item => {
        return item.columncode && item.columncode != "";
      });

      const params = {
        userid: this.sjzuser,
        callid: this.callID,
        phone: this.phonenumber, // 机主号
        owername: this.callingname, // 机主名称
        idcard: this.identitycard, // 机主身份证号
        phoneAddress: this.calladdress,
        phonetype: this.listtype, // 类型
        templetFile: this.callfile, // 文件
        configid: "", // 配置文件id
        detail: this.tabletitlist,
        startRow: this.tabletitnum,
        year: this.callyear
      };
      setTimeout(() => {
        this.isImportDisabled = false;
      }, 3000);
      calluploadfilefinish("#endfinish", "file", params, this.httpUrl);
      this.queryCallList();
      this.exportshow = false;
    },

    // 获取字段列表
    queryFiledList() {
      checkTemplateFieldPoolList()
        .then(res => {
          this.filedlist = res.data;
          const tabtitlist = [];
          res.data.forEach(item => {
            tabtitlist.push({
              columncode: item.columnCode,
              columnname: item.columnName,
              excelname: "",
              ifdisabled: false
            });
          });
          this.tabletitlist = tabtitlist;
          sessionStorage.setItem(
            "tabletitnames",
            JSON.stringify(this.tabletitlist)
          );
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 配置选项改变
    // importConfigFiledChange(code,itemobj){
    //   console.log(code, itemobj);
    //   let obj = {};
    //   obj = this.filedlist.find((item)=>{
    //     return item.columnCode === code;
    //   });
    //   itemobj.columncode = code;
    //   itemobj.columnname = obj.columnName;
    // },
    // 保存当前配置 saveSingleConfig
    saveCurrentConfig() {
      var configflag = true;
      this.tabletitlist.forEach(item => {
        delete item.ifdisabled;
        if (
          item.columnname == "对端号码" ||
          item.columnname == "呼叫时间" ||
          item.columnname == "对话时长" ||
          item.columnname == "基站小区号" ||
          item.columnname == "主被叫"
        ) {
          if (!item.excelname || item.excelname == "") {
            configflag = false;
          }
        }
      });
      if (!configflag) {
        this.$message({
          message: "对端号码,呼叫时间,对话时长,基站小区号,主被叫为必选字段",
          type: "warning"
        });
        return;
      }
      this.modelList[this.modelList.length - 1].name;
      const params = {
        name: this.modelList[this.modelList.length - 1].name, // 配置文件名称
        startRow: this.tabletitnum,
        userid: this.sjzuser, // 当前登陆用户
        detail: JSON.stringify(this.tabletitlist), // 配置列表字段
        year: this.callyear
      };
      saveSingleConfig(params)
        .then(res => {
          if (res.success == "添加成功") {
            this.$message({
              message: "保存配置成功",
              type: "success"
            });
            this.queryCallConfigList();
          } else {
            this.$message({
              message: res.fail,
              type: "warning"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 根据配置文件id获取配置内容 configTab getSingleConfigDetailListByConfigId
    configTab(configid) {
      this.currentconfigmod = configid;
      this.modelList.forEach(item => {
        if (item.id == configid) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      // this.modelList.filter((item)=>{
      //   if(item.id = configid){
      //     item.checked = true;
      //   }
      //     item.checked = false;
      // })
      if (configid) {
        const newconfigid = configid.charAt(configid.length - 1);
        if (newconfigid == "N") {
          this.tabletitlist = JSON.parse(
            sessionStorage.getItem("tabletitnames")
          );
        } else {
          getSingleConfigDetailListByConfigId({ configId: configid })
            .then(res => {
              this.tabletitlist = res.list;
              this.tabletitlist.forEach(item => {
                item.ifdisabled = true;
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    },

    // 控制配置字段展示条数 filedRetractList
    filedSpreadList() {
      this.filedspreadcon = this.tabletitlist.length + 1;
      this.filedspreadbtnshow = false;
    },
    filedRetractList() {
      this.filedspreadcon = 6;
      this.filedspreadbtnshow = true;
    },
    // 跳转统计页面
    linkStatistics(row) {
      this.$router.push({ name: "callstatistics", params: row });
    },
    // 跳转到基站轨迹
    linkBaseStationTrail() {
      if (!this.selectcalldata.length == 1) {
        this.$message({
          message: "基站轨迹请选择一条数据",
          type: "warning"
        });
        return;
      }
      this.selectcalldata[0].tailtype = "main";
      this.$router.push({
        name: "basestationtrial",
        params: this.selectcalldata[0]
      });
    },
    // 查看联系人
    seeAddressList(row) {
      this.$router.push({ name: "calladdresslist", params: row });
    },
    // 删除单个话单 deleteCallListById
    delCurrentCall(rowid) {
      this.$confirm("此操作将删除该话单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCallListById({ id: rowid }).then(res => {
            if (res.flag == 0) {
              this.$message({
                message: "删除失败",
                type: "warning"
              });
            } else {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.queryCallList();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 获取当前模板id
    queryModelList() {
      checkSingleTemplate({ loginName: this.sjzuser })
        .then(res => {
          res.forEach(item => {
            if (item.statue == 1) {
              this.templateid = item.id;
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 导出话单
    exportCall(rowid, type) {
      this.isDisable = true;
      if (type == "all") {
        const calllistidarr = [];
        if (this.selectcalldata) {
          this.selectcalldata.forEach(item => {
            calllistidarr.push(item.ID);
          });
        } else {
          this.$message({
            message: "请至少选择一条话单导出",
            type: "warning"
          });
          return;
        }
        $("#callidList").val(calllistidarr.join(","));
      } else {
        $("#callidList").val(rowid);
      }
      $("#templateId").val(this.templateid);
      var formexport = document.getElementById("exportsubmit");
      formexport.submit();
      setTimeout(() => {
        this.isDisable = false;
      }, 3000);
    },
   getPermissionList(){
    let params={
      appCode: 'hczz',
    }
    getPermission(params).then(res => {
      let bntcodelist=window.g.buttoncode
      let bntcode=''
          for(let i=0;i<res.length;i++){
             if(res[i].code==bntcodelist['callList-import']){
               this.exportbnt=true
             }
             if(res[i].code==bntcodelist['callList-config']){
                 this.callconfig=true
             }
          }
        })
   }
    
  },
  watch: {},
  mounted() {
    this.userinfo = JSON.parse(sessionStorage.getItem("userInfo"));
    // this.sjzuser = this.userinfo.loginName || "admin";
    this.sjzuser = "admin";
    this.queryCallList(); // 获取话单列表
    this.queryModelList();
    this.queryCallConfigList();
    this.getPermissionList();
  }
};
</script>
<style>
@import "../../../static/css/componentcss/callconfig.css";
@import "../../../static/css/base.css";
@import "../../../static/css/btn.css";
@import "../../../static/css/index.css";
@import "../../../static/css/main.css";
@import "../../../static/css/cdr/statistics.css";
@import "../../../static/css/componentcss/searchtable.css";
</style>
<style scoped>
@import "../../../static/css/cdr/cdr.css";
.callhead {
  height: 72px;
  line-height: 72px;
}
.callhead h3 {
  display: inline-block;
  font-size: 16px;
  color: #121e3d;
  height: 22px;
  font-weight: bold;
  line-height: 22px;
  padding-right: 10px;
  /* border-right: 1px solid #d7dde5; */
}
.callopr {
  margin: 0;
  padding-top: 22px;
}
.callopr .liBtn {
  background-color: #3173bf;
  color: #fff;
}
.callfilebox {
  height: 80%;
  overflow: auto;
}
.searchtlist {
  margin: 0;
  border: 1px solid #d7dde5;
  border-top: none;
  border-bottom: none;
}
.titleLabel {
  color: #6b757e;
}
.optInput {
  height: 28px;
}
.nameInput {
  width: 75px;
}
.idCardInput {
  width: 158px;
}
.phoneInput {
  width: 110px;
}
.addressInput {
  width: 90px;
}
.filedspread {
  width: 100%;
  height: 10%;
  background: #e3f6ff;
  text-align: center;
}
.filedspbtn {
  width: 56px;
  height: 24px;
  color: #333333;
  line-height: 24px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #a6a6a6;
  background: #f0f4f9;
  margin-top: 3px;
}
.instructext {
  color: #999999;
  margin-top: 40px;
}
.hrdiv::before{
    border-right-color: rgba(245,245,245,1);
        z-index:1
}
</style>
