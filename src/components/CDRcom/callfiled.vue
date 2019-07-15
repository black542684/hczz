<template>
  <div class="callfiled">
    <!--change region 动态区域-->
    <div class="dynamicregion">
      <!--添加字段-->
      <div class="dynamicfiled">
        <div class="filedtit">
          <span class="sorttit">排序</span>
          <i class="icon iconfont icon-xiangshang" :class="{currentsort: currentsortstyle}" @click="sortFiledList(0)"></i>
          <i class="icon iconfont icon-xiangxia" :class="{currentsort: !currentsortstyle}" @click="sortFiledList(1)"></i>
        </div>
        <div class="filedlist">
          <ul>
            <li v-for="(filed,index) in filedlist" :key="filed.id">
              <div class="filedname" @click="filedCheck(filed)">
                <span class="filedindex">{{filed.sortColumn}}</span><span class="filednametxt" :class="{noedit: filed.columnType,filedchecked: filed.ifchecked}" >{{filed.columnName}}</span>
                <!--<input class="filednametxt" :class="{noedit: !filed.ifdel,inpchecked: filed.ifchecked}" :disabled="!filed.ifdel" type="text" v-model="filed.name"/>-->
              </div>
              <button class="fileddel" v-if="!filed.columnType" @click="delFiled(filed.id,filed.sortColumn)">删除</button>
            </li>
          </ul>
        </div>
        <div class="dynamicfiledcon">
          <a href="javascript:;" @click="addFiled"><span class="el-icon-circle-plus-outline addmodelicon"></span>添加字段</a>
        </div>
      </div>
      <!--配置字段-->
      <div class="setfiled">
        <div class="filedtit">
          <span class="sorttit">字段设置 > {{fileditem.columnName}}</span>
        </div>
        <div class="setregion">
          <div class="radiobox">
            <label class="sortlabel">是否排序</label>
            <el-radio-group v-model="ifsort" @change="filedSort">
              <el-radio label="1">是</el-radio><el-radio label="0">否</el-radio>
            </el-radio-group>
          </div>
          <!-- <div class="radiobox">
            <label class="sortlabel">是否筛选</label>
            <el-switch v-model="iffilter"></el-switch>
          </div>
          <div class="radiobox">
            <label class="sortlabel">自定义筛选值</label>
            <el-switch v-model="ifuserdefined"></el-switch>
          </div> -->
        </div>
        <!-- <div class="setregion">
          <div class="radiobox tableindata">
            <label class="sortlabel">表内数据值</label>
            <el-radio v-model="iftableindata" label="5">是</el-radio><el-radio v-model="iftableindata" label="6">否</el-radio>
          </div>
          <div class="radiobox">
            <el-input placeholder="主叫" :disable="iftableindata" style="width: 70%;background: inherit;margin-bottom: 12px;"></el-input>
            <el-input placeholder="被叫" :disable="iftableindata" style="width: 70%;background: inherit;"></el-input>
          </div>
        </div>
        <div class="dynamicfiledcon">
          <a href="javascript:;" @click="addFilterItem"><span class="el-icon-circle-plus-outline addmodelicon"></span>添加筛选项</a>
        </div> -->
      </div>
      <!--固定字段区域 全局设置-->
      <div class="fixregion">
        <div class="filedtit">
          <span class="sorttit">全局设置</span>
        </div>
        <div class="allset">
          <div class="setregion" style="width: 100%;">
            <div class="radiobox">
              <label class="sortlabel">默认排序</label>
              <el-switch v-model="defaultsort" @change="defaultSortSS"></el-switch>
            </div>
            <div v-show="defaultsortshow" class="radiobox">
              <el-select v-model="fileditemsort" @change="selectedfiledname" clearable placeholder="请选择">
                <el-option
                  v-for="item in filedlist"
                  :key="item.columnCode"
                  :label="item.columnName"
                  :value="item.columnCode">
                </el-option>
              </el-select>
              <el-radio-group v-model="sortfiled" @change="defaultSort">
                <el-radio :label="0">升序</el-radio>
                <el-radio :label="1">倒序</el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- <div class="setregion" style="width: 100%;">
            <div class="radiobox allsetbox">
              <label class="sortlabel">合并设置</label>
              <el-switch v-model="merge"></el-switch>
              <button class="fileddel" @click="addMergeFiled">添加合并字段</button>
            </div>
            <div class="radiobox">
              <el-select v-model="benchmarkfiled" clearable placeholder="请选择">
                <el-option
                  v-for="item in filedlist"
                  :key="item.columnCode"
                  :label="item.columnName"
                  :value="item.columnCode">
                </el-option>
              </el-select>
              <label class="sortlabel">基准字段</label>
            </div>
            <div v-for="item in mergefiledlist" :key="item.id" class="radiobox">
              <el-select v-model="item.filedName" @change="selectedfilednamemeger" clearable placeholder="请选择">
                <el-option
                  v-for="item in filedlist"
                  :key="item.columnCode"
                  :label="item.columnName"
                  :value="item.columnCode">
                </el-option>
              </el-select>
              <button class="fileddel" v-if="mergedelbtnshow" @click="delMergeFiled(item.id)">删除</button>
            </div>
          </div> -->
          <div class="setregion" style="width: 100%;">
            <div class="radiobox allsetbox">
              <label class="sortlabel">时间类型</label>
              <el-switch v-model="timetype" @change="timeTypeSwitch"></el-switch>
              <button class="fileddel" @click="addTimeTypeImitate">添加时间</button>
            </div>
            <div v-show="timetype" class="radiobox" v-for="timetypeitem in timetypelist">
              <input class="allsetinput" type="text" v-model="timetypeitem.timeName"/>
              <el-time-picker
                is-range
                v-model="timetypeitem.time"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="HH:mm"
                value-format="HH:mm"
                @change="timeTypeChange(timetypeitem)"
                placeholder="选择时间范围">
              </el-time-picker>
              <button class="fileddel" v-show="timetypeitem.issave" @click="addTimeTypeSave(timetypeitem)">确定</button>
              <el-color-picker v-model="timetypeitem.timeColor" size="mini" @change="colorChange(timetypeitem.timeColor,timetypeitem,'time')"></el-color-picker>
              <!--<button class="fileddel">颜色</button>-->
              <button class="fileddel" @click="delTimeType(timetypeitem.id)">删除</button>
            </div>

          </div>
          <div class="setregion" style="width: 100%;">
            <div class="radiobox allsetbox">
              <label class="sortlabel">时长类型</label>
              <el-switch v-model="durationtype" @change="timeLenTypeSwitch"></el-switch>
              <button class="fileddel" @click="addTimeLenTypeShowDiag">添加时长类型</button>
            </div>
            <div v-show="durationtype" class="radiobox durationbox" v-for="duration in durationlist" :key="duration.id">
              <input class="allsetinput" type="text" v-model="duration.typeName"/>
              <input class="allsetinput inpmini" type="text" v-model="duration.typeStartIndex">
              <el-select v-model="duration.typeComple" clearable placeholder="请选择">
                <el-option
                  v-for="item in regionlist"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
              <input class="allsetinput inpmini" v-show="duration.typeComple=='至' || duration.typeComple=='2'" type="text" v-model="duration.typeEndIndex">
              <label class="sortlabel">单位：秒</label>
              <el-color-picker v-model="duration.typeColor" size="mini" @change="colorChange(duration.typeColor,duration,'timelen')"></el-color-picker>
              <button v-show="duration.issave" @click="addTimeLenTypeSave(duration)" class="fileddel">保存</button>
              <button class="fileddel" @click="delTimeLenType(duration.id)">删除</button>
            </div>
          </div>
          <div class="setregion endsetregion" style="width: 100%;">
            <div class="filedshow">
              <label class="sortlabel">结束时间</label>
              <el-switch v-model="defendtime" @change="endTimeSwitch"></el-switch>
            </div>
            <div class="filedshow">
              <label class="sortlabel">星期</label>
              <el-switch v-model="weekswitchva" @change="weekSwitchFun"></el-switch>
            </div>
            <div class="filedshow">
              <label class="sortlabel">基站名称</label>
              <el-switch v-model="baseaddswitch" @change="baseAddSwitch"></el-switch>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!--添加字段弹框-->
    <el-dialog title="添加字段" :modal-append-to-body='false' class="casetatilbox" width="680px" :visible.sync="addfileddiagshow">
      <div class="dialogbox">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="字段名称">
            <!--filedoptions-->
            <el-select v-model="filedname" @change="selectFiledAdd" placeholder="请选择">
              <el-option
                v-for="item in filedoptions"
                :key="item.columnCode"
                :label="item.columnName"
                :value="item.columnCode">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer calldiafootbtn">
        <button type="primary" class="calldiabtn callbtnconfirm" @click="addFiledSave">确 定</button>
        <button class="calldiabtn" @click="addfileddiagshow = false">取 消</button>
      </div>
    </el-dialog>

    <!--添加时间类型弹框 timetypediagshow-->
    <el-dialog title="添加时间类型" :modal-append-to-body='false' class="casetatilbox" width="680px" :visible.sync="timetypediagshow">
      <div class="dialogbox">
        <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
          <el-form-item label="时间类型名称">
            <el-input v-model="timetypename"></el-input>
          </el-form-item>
          <el-form-item label="时间类型">
            <el-time-picker
              v-model="timetypestart"
              placeholder="任意时间点">
            </el-time-picker>
            <span>-</span>
            <el-time-picker
              arrow-control
              v-model="timetypeend"
              placeholder="任意时间点">
            </el-time-picker>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer calldiafootbtn">
        <button type="primary" class="calldiabtn callbtnconfirm" @click="addTimeTypeSave">确 定</button>
        <button class="calldiabtn" @click="addfileddiagshow = false">取 消</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {checkSingleTemplateList, checkTemplateFieldPoolList, singleTemplateField,
    singleTemplateFieldSwitch, singleTemplateFieldSortSwitch, templateGlobalConfigurationSort,
    mergeField, checkMergeField, checkTimeType, timeType, checkTimeLengthType, timeLengthType,
    updateTimeLengthType, updateTimeType, updateSingleFieldSort, deleteMergeFieldEntityByid,
    deleteTimeTypeByid, deleteTimeLengthTypeByid, checkSortList, deleteSingleTemplateField} from '@/service/cdr'
  import {guid} from '@/service/workUtil'

  export default {
    name: 'callfiled',
    props: {
      templateid: String
    },
    data(){
      return {
        formLabelAlign: 'left',
        userinfo: {},
        sjzuser: '',
        childtemplateid: '',
        value4: [new Date(2016, 9, 10, 8, 40), new Date(2016, 9, 10, 9, 40)],
        ifsort: '', // 是否排序
        iffilter: '', // 是否筛选
        ifuserdefined: '', // 自定义筛选值
        iftableindata: false, // 表内数据值
        filedlist: [
          {
            id: '1',
            name: '结束时间',
            num: 'jieshushijian',
            length: 5,
            ifedit: false,
            ifchecked: false, // 是否选中
            ifdel: false // 是否可被删除
          }, {
            id: '2',
            name: '星期',
            num: 'xingqi',
            length: 5,
            ifedit: false,
            ifchecked: false, // 是否选中
            ifdel: false // 是否可被删除
          }, {
            id: '3',
            name: '时间类型',
            num: 'shijianleixing',
            length: 5,
            ifedit: false,
            ifchecked: false, // 是否选中
            ifdel: false // 是否可被删除
          }, {
            id: '4',
            name: '时长类型',
            num: 'shichangleixing',
            length: 5,
            ifedit: false,
            ifchecked: false, // 是否选中
            ifdel: false // 是否可被删除
          }, {
            id: '5',
            name: '基站名称',
            num: 'jizhanmingcheng',
            length: 5,
            ifedit: false,
            ifchecked: false, // 是否选中
            ifdel: false // 是否可被删除
          }, {
            id: '6',
            name: '通话类型',
            num: 'tonghualeixing',
            length: 5,
            ifedit: false,
            ifchecked: false, // 是否选中
            ifdel: true // 是否可被删除
          }
        ],
        fileditem: {}, // 选中项数据
        defaultsort: false, // 默认排序
        fileditemsort: '', // 按照某个字段排序
        filedoptions: [
          {
            id: '1',
            label: '通话类型'
          }, {
            id: '2',
            label: '对端号码'
          }, {
            id: '3',
            label: '对端机主'
          }, {
            id: '4',
            label: '起始时间'
          }
        ],
        sortfiled: '', // 选择字段排序方式
        merge: true, // 合并设置
        // 基准字段
        benchmarkfiled: '',
        benchmarkoptions: [
          {
            id: '1',
            label: '对端号码'
          }, {
            id: '2',
            label: '对端机主'
          }
        ],
        selectbenchmark: '',
        timetype: true, // 时间类型
        timetypelist: [
          {
            id: '1',
            name: '工作',
            time: '',
            ifdel: false
          }, {
            id: '2',
            name: '私人',
            time: '',
            ifdel: false
          }, {
            id: '3',
            name: '私密',
            time: '',
            ifdel: true
          }
        ],
        job: '工作',
        private: '私人',
        prisecret: '私密',
        durationtype: true, // 时长类型
        durationlist: [
          {
            id: '1',
            name: '15秒以内',
            durationstart: 15,
            durationend: 0,
            region: '小于'
          }, {
            id: '2',
            name: '15秒-1分钟',
            durationstart: 15,
            durationend: 60,
            region: '至'
          }, {
            id: '3',
            name: '1分钟-3分钟',
            durationstart: 60,
            durationend: 180,
            region: '至'
          }, {
            id: '4',
            name: '5分钟以上',
            durationstart: 300,
            durationend: 0,
            region: '大于'
          }
        ],
        regionlist: [
          {
            id: '1',
            label: '小于'
          }, {
            id: '2',
            label: '至'
          }, {
            id: '3',
            label: '大于'
          }
        ],
        addfileddiagshow: false, // 添加字段弹框显示
        filedname: '', // 字段名称
        filednum: '', // 字段编号 即字段名称的英文名
        filedlength: '', // 字段长度
        labelPosition: 'left',
        filedid: '', // 字段id
        defaultfiledid: '', // 默认字段设置
        deffiledcode: '',
        deffiledname: '',
        defaultsortshow: false,
        mergefiledlist: [],
        mergedelbtnshow: true,
        // 默认字段id
        timetypeid: '', // 时间类型id
        timetypelenid: '', // 时长类型id
        endtimeid: '', // 结束时间id
        weekid: '', // 星期id
        baseaddid: '', // 基站名称id
        timetypediagshow: false, // 添加时间类型弹框
        timetypename: '', // 时间类型名称
        timetypestart: new Date(2016, 9, 10, 18, 40), // 时间类型时间
        timetypeend: new Date(2016, 9, 10, 18, 40), // 时间类型时间
        timelendiagshow: false, // 添加时长类型
        defendtime: true,
        weekswitchva: true,
        baseaddswitch: true,
        timelentypecolor: '', // 时长类型颜色
        addfiledname: '', // 添加字段字段名称
        addfilecode: '', // 添加字段字段编码
        currentsortstyle: true, // 当前排序样式
        currentfilednum: 0, // 当前选中字段序号
        currentfiledid: '' // 当前选中字段的id

      }
    },
    methods: {
      // 添加字段弹框显示
      addFiled () {
        this.addfileddiagshow = true
        this.querySelectFiled()
      },
      // 选择字段
      selectFiledAdd (filedcode) {
        const obj = this.filedoptions.find((item) => {
          return item.columnCode === filedcode
        })
        this.addfiledname = obj.columnName // 添加字段字段名称
        this.addfilecode = filedcode // 添加字段字段编码
      },
      // 添加字段
      addFiledSave () {
        let newfiledid = this.filedlist.length + 1 + ''
        this.filedlist.push({
          id: newfiledid,
          name: this.filedname,
          num: this.filednum,
          length: this.filedlength,
          ifedit: false,
          ifchecked: false, // 是否选中
          ifdel: true // 是否可被删除
        })
        const params = {
          columnCode: this.addfilecode,
          columnName: this.addfiledname,
          templateId: this.childtemplateid,
          createUser: this.sjzuser,
          sortColumn: this.filedlist.length
        }
        singleTemplateField(params).then((res) => {
          if (res.flag == 0) {
            this.$message({
              message: '添加字段成功',
              type: 'success'
            })
            this.queryFiledList()
          } else {
            this.$message({
              message: '添加字段失败',
              type: 'warning'
            })
            this.queryFiledList()
          }
          this.addfiledname = '' // 添加字段字段名称
          this.addfilecode = '' // 添加字段字段编码
        }).catch((err) => {
          console.log(err)
        })
        this.addfileddiagshow = false
      },
      // 删除该字段 deleteSingleTemplateField
      delFiled (filedid, filedindex) {
        this.$confirm('此操作将删除该字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            templateId: this.childtemplateid,
            id: filedid,
            sortColumn: filedindex
          }
          deleteSingleTemplateField(params).then((res) => {
            if (res.flag == 1) {
              this.$message({
                message: '删除字段成功',
                type: 'success'
              })
              this.queryFiledList()
            } else {
              this.$message({
                message: '删除字段失败',
                type: 'warning'
              })
              this.queryFiledList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 选中该字段
      filedCheck (filed) {
        this.fileditem = filed
        this.filedid = filed.id
        this.ifsort = filed.columnSort + ''
        this.currentfilednum = filed.sortColumn - 0
        this.currentfiledid = filed.id
        this.filedlist.forEach((item) => {
          if (item.id == filed.id) {
            item.ifchecked = true
          } else {
            item.ifchecked = false
          }
        })
      },
      // 字段列表排序升序
      filedListASC () {
        this.currentsortstyle = true
        return this.filedlist.sort((a, b) => a.index < b.index)
      },
      // 字段列表排序降序
      filedListDesc () {
        this.currentsortstyle = false;
        return this.filedlist.sort((a, b) => a.index > b.index)
      },
      sortFiledList (sorttype) {
        if (!this.currentfiledid || this.currentfiledid == '') {
          this.$message({
            message: '请选择要排序的字段',
            type: 'warning'
          })
          return
        }
        if (sorttype == 0) {
          this.currentfilednum--
          this.currentsortstyle = true
        } else {
          this.currentfilednum++
          this.currentsortstyle = false
        }
        const params = {
          templateId: this.childtemplateid,
          id: this.currentfiledid,
          sortColumn: this.currentfilednum,
          type: sorttype // 0 升序 1 降序
        }
        updateSingleFieldSort(params).then((res) => {
          if (res.flag == 1) {
            this.queryFiledList()
          }
        }).catch((err) => {
          console.log(err)
        });
      },

      filedSort () {
        this.filedIsSort(this.filedid, this.ifsort - 0)
      },
      // 添加筛选项
      addFilterItem () {
      },

      // 获取字段列表
      queryFiledList () {
        checkSingleTemplateList({ templateId: this.childtemplateid }).then((res) => {
          this.filedlist = res
          this.filedlist.forEach((item, index) => {
            item.index = index + 1
            if (item.columnName=='时间类型') {
              this.timetypeid = item.id
              this.timetype = item.columnIsuse == '1' ? true : false
            } else if (item.columnName=='时长类型'){
              this.timetypelenid = item.id
              this.durationtype = item.columnIsuse == '1' ? true : false
            } else if (item.columnName == '结束时间') {
              this.endtimeid = item.id
              this.defendtime = item.columnIsuse == '1' ? true : false
            } else if (item.columnName=='星期') {
              this.weekid = item.id
              this.weekswitchva = item.columnIsuse == '1' ? true : false
            } else if (item.columnName == '基站名称') {
              this.baseaddid = item.id
              this.baseaddswitch = item.columnIsuse == '1' ? true : false
            }
            if (this.currentfiledid && item.id == this.currentfiledid) {
              item.ifchecked = true;
            }
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取可选字段
      querySelectFiled () {
        checkTemplateFieldPoolList().then((res) => {
          this.filedoptions = res.data
        }).catch((err) => {
          console.log(err)
        })
      },
      // 控制开关
      switchFiled (filedid, switchvalue) {
        const params = {
          id: filedid,
          columnIsuse: switchvalue
        }
        singleTemplateFieldSwitch(params).then((res) => {
          if (res.flag == 0) {
            this.queryFiledList()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 时间类型 timetypeid
      timeTypeSwitch () {
        // timetype
        var timeswitchvalue = ''
        if (this.timetype == true) {
          timeswitchvalue = '1'
          this.timetypedisp = true
        } else if (this.timetype == false) {
          timeswitchvalue = '0'
          this.timetypedisp = true
        }
        this.switchFiled(this.timetypeid,timeswitchvalue)
      },
      // 时长类型
      timeLenTypeSwitch () {
        var timeswitchvalue = ''
        if (this.durationtype == true) {
          timeswitchvalue = '1'
        } else if (this.durationtype == false) {
          timeswitchvalue = '0'
        }
        this.switchFiled(this.timetypelenid, timeswitchvalue)
      },

      // 删除时间类型 deleteTimeTypeByid
      delTimeType (rowid) {
        deleteTimeTypeByid({id: rowid}).then((res) => {
          if (res.flag == 1) {
            this.$message({
              message: '删除字段成功',
              type: 'success'
            })
            this.queryTimeTypeList()
          } else {
            this.$message({
              message: '删除字段失败',
              type: 'warning'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 结束时间
      endTimeSwitch(){
        var timeswitchvalue = ''
        if (this.defendtime == true) {
          timeswitchvalue = '1'
        } else if (this.defendtime == false){
          timeswitchvalue = '0'
        }
        this.switchFiled(this.endtimeid, timeswitchvalue)
      },
      // 星期
      weekSwitchFun () {
        var timeswitchvalue = ''
        if (this.weekswitchva == true) {
          timeswitchvalue = '1'
        } else if (this.weekswitchva == false) {
          timeswitchvalue = '0'
        }
        this.switchFiled(this.weekid, timeswitchvalue)
      },
      // 基站名称
      baseAddSwitch () {
        var timeswitchvalue = ''
        if (this.baseaddswitch == true) {
          timeswitchvalue = '1'
        } else if (this.baseaddswitch == false) {
          timeswitchvalue = '0'
        }
        this.switchFiled(this.baseaddid,timeswitchvalue)
      },

      // 是否排序 singleTemplateFieldSortSwitch
      filedIsSort (filedid, sortvalue) {
        const params = {
          id: filedid,
          columnSort: sortvalue
        }
        singleTemplateFieldSortSwitch(params).then((res) => {

        }).catch((err) => {
          console.log(err)
        })
      },
      // 下拉框选中值改变
      selectedfiledname (columnCode) {
        let obj = {}
        obj = this.filedlist.find((item) => {
          return item.columnCode === columnCode
        })
        this.deffiledcode = columnCode
        this.deffiledname = obj.columnName
      },
      defaultSortSS () {
        this.defaultsortshow = this.defaultsort
      },
      // 默认排序
      defaultSort () {
        if (!this.fileditemsort || this.fileditemsort == '') {
          this.$message({
            message: '请选择排序字段',
            type: 'warning'
          })
          return
        }
        const params = {
          templateId: this.childtemplateid,
          columnName: this.deffiledname,
          columnCode: this.deffiledcode,
          columnSort: this.sortfiled - 0
        }
        templateGlobalConfigurationSort(params).then((res) => {

        }).catch((err) => {
          console.log(err)
        })
      },
      // 合并字段
      // 查询合并字段 checkMergeField
      queryMergeField () {
        checkMergeField({templateId: this.childtemplateid}).then((res) => {
          this.mergefiledlist = res.data // this.mergedelbtnshow
          if (this.mergefiledlist.length <= 1) {
            this.mergedelbtnshow = false
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 添加合并字段
      addMergeFiled () {
        let newfiledid = this.mergefiledlist.length + 1 + ''
        this.mergefiledlist.push({
          id: newfiledid,
          filedName: '',
          filedCode: '',
          mergeFieldStatue: ''
        })
      },
      // 删除合并字段 deleteMergeFieldEntityByid
      delMergeFiled (filedid) {
        this.$confirm('此操作将删除该合并字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMergeFieldEntityByid({id: filedid}).then((res) => {
            if (res.flag == 0) {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
            } else {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.queryMergeField()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 合并字段下拉框选中值改变
      selectedfilednamemeger (columnCode) {
        const obj = this.filedlist.find((item) => {
          return item.columnCode === columnCode
        })
        const params = {
          templateId: this.childtemplateid,
          filedName: obj.columnName,
          filedCode: columnCode,
          createUser: this.sjzuser
        }
        mergeField(params).then((res) => {
          if (res.flag == 0) {
            this.queryMergeField()
          }
        }).catch((err) => {
          console.log(err)
        })

      },
      // 时间类型
      // 获取时间类型列表 timetypelist checkTimeType
      queryTimeTypeList () {
        checkTimeType({templateId: this.childtemplateid}).then((res) => {
          this.timetypelist = res.data
          this.timetypelist.forEach((item) => {
            item.issave = false
            const time = []
            if (item.timeStartValue) {
              time.push(item.timeStartValue)
            }
            if (item.timeEndValue) {
              time.push(item.timeEndValue)
            }
            item.time = time
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 添加时间类型弹框显示
      addTimeTypeImitate () {
        this.timetypelist.push({
          id: guid,
          timeColor: '',
          timeStartValue: '',
          timeEndValue: '',
          issave: true
        })
      },
      // 添加时间类型 timeType
      addTimeTypeSave (item) {
        const params = {
          templateId: this.childtemplateid,
          timeStartValue: item.time[0],
          timeEndValue: item.time[1],
          createUser: this.sjzuser,
          timeName: item.timeName
        }
        timeType(params).then((res) => {
          if (res.flag == 0) {
            this.queryTimeTypeList()
          }
        }).catch((err) => {
          console.log(err)
        })
        this.timetypediagshow = false
      },

      // 时间类型时间改变
      timeTypeChange (item) {
      },

      // 时长类型
      // 获取时长类型 regionlist checkTimeLengthType
      queryRegionList () {
        checkTimeLengthType({templateId: this.childtemplateid}).then((res) => {
          this.durationlist = res.data
          this.durationlist.forEach((item) => {
            item.issave = false
          })
        }).catch((err) => {
          console.log(err)
        })
      },
      // 模拟添加
      addTimeLenTypeShowDiag () {
        let newfiledid = this.mergefiledlist.length + 1 + ''
        this.durationlist.push({
          id: newfiledid,
          issave: true,
          typeStartIndex: '', // 开始值
          typeEndIndex: '',
          typeName: '',
          typeComple: '', // 比较类型
        })
      },
      // 添加时长类型 timeLengthType
      addTimeLenTypeSave (row) {
        if (row.typeComple =='1') {
          row.typeComple = '小于'
        } else if (row.typeComple =='2') {
          row.typeComple = '至'
        } else if (row.typeComple =='3') {
          row.typeComple = '大于'
        }
        const params = {
          templateId: this.childtemplateid,
          typeStartIndex: row.typeStartIndex, // 开始值
          typeEndIndex: row.typeEndIndex,
          createUser: this.sjzuser,
          typeName: row.typeName,
          typeComple: row.typeComple // 比较类型
        }
        timeLengthType(params).then((res) => {
          if (res.flag == 0) {
            this.queryRegionList()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 时间类型修改
      updataTimeType (duration) {
        const params = {
          id: duration.id,
          timeColor: duration.timeColor,
          timeName: duration.timeName,
          timeEndValue: duration.timeEndValue,
          timeStartValue: duration.timeStartValue
        }
        updateTimeType(params).then((res) => {
          this.queryTimeTypeList()
        }).catch((err) => {
          console.log(err)
        });
      },
      // 时长类型修改
      updataTimeLenType (duration) {
        const params = {
          id: duration.id,
          typeColor: duration.typeColor,
          typeComple: duration.typeComple,
          typeName: duration.typeName,
          typeEndIndex: duration.typeEndIndex,
          typeStartIndex: duration.typeStartIndex
        }
        updateTimeLengthType(params).then((res) => {
          this.queryRegionList()
        }).catch((err) => {
          console.log(err)
        })
      },
      // 时长类型颜色变化
      colorChange (color, duration, type) {
        if (type == 'time') {
          duration.timeColor = color
          this.updataTimeType(duration)
        } else if (type == 'timelen') {
          duration.typeColor = color
          this.updataTimeLenType(duration)
        }
      },
      // 删除时长类型
      delTimeLenType (rowid) {
        deleteTimeLengthTypeByid({id: rowid}).then((res) => {
          if (res.flag == 1) {
            this.$message({
              message: '删除字段成功',
              type: 'success'
            })
            this.queryRegionList()
          } else {
            this.$message({
              message: '删除字段失败',
              type: 'warning'
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取默认字段排序列表
      queryDefaulFiledSort () {
        checkSortList({templateId: this.childtemplateid}).then((res) => {
          if(res.data[0]){
            if (res.data[0].columnIssort == '1') {
              this.defaultsort = true
              this.defaultsortshow = true
            } else {
              this.defaultsort = false
              this.defaultsortshow = false
            }
            this.deffiledcode = res.data[0].columnCode
            this.fileditemsort = res.data[0].columnName
            this.sortfiled = res.data[0].columnSort
          }
        }).catch((err) => {
          console.log(err)
        })
      }

    },
    watch: {
      templateid (val) {
        this.childtemplateid = val
        this.queryFiledList()
        this.queryMergeField() // 查询合并字段
        this.queryTimeTypeList() // 查询时间类型列表
        this.queryRegionList() // 查询时长类型列表
        this.queryDefaulFiledSort() // 查询默认字段排序列表
      },
      mergefiledlist (val) {
        if (val.length >= 1) {
          this.mergedelbtnshow = true;
        } else {
          this.mergedelbtnshow = false;
        }
      }
    },
    mounted(){
      this.userinfo = JSON.parse(sessionStorage.getItem('userInfo'))
      this.sjzuser = this.userinfo.loginName
      this.fileditem = this.filedlist[0]
      this.childtemplateid = this.templateid
      this.queryFiledList()
      this.queryMergeField() // 查询合并字段
      this.queryTimeTypeList() // 查询时间类型列表
      this.queryRegionList() // 查询时长类型列表
      this.queryDefaulFiledSort() // 查询默认字段排序列表
    }
  }
</script>

<style scoped>
  .callfiled {
    width: 100%;
    /* width: 100%; */
    height: 100%;
    font-size: 12px;
  }
  /*动态字段配置区域*/
  .dynamicregion {
    width: 100%;
    height: 100%;
  }

  /*动态字段*/
  /*添加字段*/
  .dynamicfiled {
    float: left;
    padding: 12px 0px;
    width: 26%;
    height: 96%;
    border-right: 1px solid #dcdee2;
  }
  .filedtit {
    padding-left: 25px;
    padding-bottom: 10px;
  }
  .sorttit {
    font-size: 14px;
    color: #333333;
    font-weight: 700;
    margin-right: 12px;
  }
  .filedlist {
    padding-left: 25px;
    padding-right: 20px;
    width: 100%;
    height: 86%;
    overflow-y: auto;
    border-bottom: 1px dotted #dcdee2;
  }
  .filedlist li {
    margin-bottom: 15px;
    width: 100%;
  }
  .filedname {
    width: 67%;
    height: 26px;
    border: 1px solid #dcdee2;
    border-radius: 5px;
    line-height: 26px;
    color: #666666;
    display: inline-block;
  }
  .filedname .filedindex {
    display: inline-block;
    width: 15%;
    height: 100%;
    text-align: center;
    border-right: 1px solid #dcdee2;
  }

  .filedname .filednametxt {
    display: inline-block;
    width: 84%;
    height: 26px;
    vertical-align: top;
    padding-left: 10px;
    padding-right: 10px;
    box-sizing: border-box;
  }

  .dynamicfiledcon {
    width: 57%;
    margin: 10px auto;
    text-align: center;
  }
  .dynamicfiledcon a {
    color: #2d8cf0;
  }

  /*输入框不可编辑状态*/
  .filedname .noedit {
    background: #f8f8f9;
    border-radius: 0 5px 5px 0;
  }
  .filedname .inpchecked {
    background: linear-gradient(#b3e6ff, #9dc9ff);
  }
  /*当前字段选中*/
  .filedname .filedchecked {
    background: linear-gradient(#b3e6ff, #9dc9ff);
  }

  /*删除按钮*/
  .fileddel {
    min-width: 42px;
    height: 24px;
    line-height: 24px;
    padding: 0 5px;
    background: #ffffff;
    border-radius: 3px;
    border: 1px solid #dcdee2;
    margin-left: 15px;
    font-size: 12px;
    color: #515a6e;
    vertical-align: top;
  }

  /*设置字段*/
  .setfiled {
    float: left;
    width: 23%;
    height: 100%;
    padding: 12px 0px;
    border-right: 1px solid #dcdee2;
  }
  .setfiled .filedtit {
    padding-left: 15px;
  }
  /*设置字段区域*/
  .setregion {
    padding-left: 15px;
    border-bottom: 1px dotted #dcdee2;
  }
  .endsetregion {
    border-bottom: 0;
  }
  .sortlabel {
    margin-right: 10px;
  }
  .radiobox {
    width: 100%;
    margin-bottom: 20px;
  }
  .tableindata {
    margin-top: 12px;
  }

  /*全局设置*/
  .fixregion {
    float: left;
    width: 50%;
    height: 100%;
    padding-top: 12px;
    overflow-y: auto;
  }
  .fixregion .filedtit {
    padding-left: 15px;
  }
  .allset {
    width: 100%;
    height: 100%;
    /*overflow-y: auto;*/
  }
  .allsetbox {
    margin-top: 12px;
  }
  .fixregion .radiobox {
    margin-bottom: 10px;
  }
  .allsetinput {
    width: 110px;
    height: 26px;
    line-height: 26px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 12px;
    color: #515a6e;
    border: 1px solid #dcdee2;
    border-radius: 5px;
    vertical-align: top;
  }
  .fixregion .fileddel {
    margin-left: 5px;
  }
  .inpmini {
    width: 45px;
  }

  .filedshow {
    width: 32.5%;
    margin-top: 10px;
    margin-bottom: 10px;
    display: inline-block;
  }

  /*弹框样式*/
  .dialogbox {
    height: 300px;
    padding: 20px 20px 20px 50px;
  }

  .calldiafootbtn {

  }
  .calldiafootbtn .calldiabtn {
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: 0;
    border-radius: 5px;
    color: #606266;
    background: linear-gradient(#ffffff, #d7d7d7);
  }
  .calldiafootbtn .callbtnconfirm {
    color: #ffffff;
    background: linear-gradient(#42abe0, #428ce6);
  }

  .icon-xiangshang {
    font-size: 20px;
    margin-right: 10px;
  }
  .icon-xiangxia {
    font-size: 19px;
  }
  .currentsort {
    color: #3caaff;
  }

  .el-color-picker {
    vertical-align: top;
  }
</style>
