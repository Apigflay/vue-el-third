<template> 
    <div class="main">
        <!-- <div class="block" style="padding:30px 0px 30px 50px">
            <span class="demonstration">日期范围：</span>
            <el-date-picker
                v-model="value1"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" icon="el-icon-search" @click="getChooseList">选择日期查询</el-button>
            <el-button type="primary" icon="" @click="getLastList">上周数据</el-button>
            <el-button type="primary" icon="" @click="getNowList">本周数据</el-button>
        </div> -->
        <div ref="exportExcel" id="out-table" class="app-container">
             <el-table 
              border
              :data="allAdressList"
              style="width: 100%">
              <!-- 单选框 -->
              <el-table-column
                type="selection">
              </el-table-column>
              <!-- 序号 -->
              <el-table-column
                label="序号"
                type="index"
                width=""
                sortable
                prop="">
              </el-table-column>
              <!-- 日期 -->
              <!-- <el-table-column
                label="日期"
                width=""
                sortable
                prop="updatetime">
              </el-table-column> -->
              <!-- 主播昵称 -->
              <el-table-column
                label="主播昵称"
                width=""
                sortable
                prop="nickname">
              </el-table-column>
              <!-- 主播ID -->
              <el-table-column
                label="主播ID"
                width=""
                sortable
                prop="useridx">
              </el-table-column>
              <!-- 操作 -->
             <el-table-column
                fixed="right"
                label="操作"
                width="">
                <template slot-scope="scope">
                  <el-button type="text" size="small" @click="goDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
              
               
            </el-table>
          
        </div>
        <!-- 分页 -->
        <div class="block_fenye">
          <!-- <span class="demonstration">完整功能</span> -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[10]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="allCount">
          </el-pagination>
        </div>
    </div>
  
</template>
<script>
  import FileSaver from 'file-saver';
  import XLSX from 'xlsx';
  export default {
    name: "productList",
    data() {
      return {
        value1: '',//搜索日期
        begintime:'',//搜索开始时间
        endtime:'',//搜索结束时间
        lastfirstDay:'',//上周一的日期
        lastendDay:'',//上周日的日期
        firstDay:'',//本周一的日期
        nowDay:'',//今天的日期
        allAdressList:null,//本周数据
        pageindex:1,//分页的索引
        allCount:0,//列表信息zong条数
        currentPage4:1,//当前页数

      }
    },
    created() {
      this.getDay()
      this.getOptionAdressMsg();
    },
    watch: {
      
    },
    filters: {
      
    },
    methods: {
      //获取今天日期和周一日期  上周一日期和上周日日期
      getDay:function(){
        var nowTemp = new Date();//当前时间
        var dateTime = nowTemp.getTime(); // 获取现在的时间
        var dateDay = nowTemp.getDay();
        var oneDayTime = 24 * 60 * 60 * 1000;
        var proWeekList = [];//上周的日期
        for(var i = 0; i < 7; i++){
          var time = dateTime - (dateDay + (7 - 1 - i)) * oneDayTime;
          proWeekList[i] = new Date(time); //date格式转换为yyyy-mm-dd格式的字符串
        }
        var lastfirst_year = proWeekList[0].getFullYear();
        var lastfirst_month = proWeekList[0].getMonth()+1<10?'0'+(proWeekList[0].getMonth()+1):proWeekList[0].getMonth()+1;
        var lastfirst_date = proWeekList[0].getDate()<10?'0'+proWeekList[0].getDate():proWeekList[0].getDate();
        var lastfirstDay=lastfirst_year+'-'+lastfirst_month+'-'+lastfirst_date//上周一的年月日
        this.lastfirstDay=lastfirstDay;
        var lastend_year = proWeekList[6].getFullYear();
        var lastend_month = proWeekList[6].getMonth()+1<10?'0'+(proWeekList[6].getMonth()+1):proWeekList[6].getMonth()+1;
        var lastend_date = proWeekList[6].getDate()<10?'0'+proWeekList[6].getDate():proWeekList[6].getDate();
        var lastendDay=lastend_year+'-'+lastend_month+'-'+lastend_date//上周日的年月日
        this.lastendDay=lastendDay;
        var oneDayLong = 24*60*60*1000 ;//一天的毫秒数
        var c_time = nowTemp.getTime() ;//当前时间的毫秒时间
        var c_day = nowTemp.getDay()||7;//当前时间的星期几
        var m_time = c_time - (c_day-1)*oneDayLong;//当前周一的毫秒时间
        var monday = new Date(m_time);//设置当前周一时间对象
        var m_year = monday.getFullYear();
        var m_month = monday.getMonth()+1<10?'0'+(monday.getMonth()+1):monday.getMonth()+1;
        var m_date = monday.getDate()<10?'0'+monday.getDate():monday.getDate();
        var firstDay=m_year+'-'+m_month+'-'+m_date//周一的年月日
        this.firstDay=firstDay;
        var year=nowTemp.getFullYear();//今天年
        var month=nowTemp.getMonth()+1<10?'0'+(nowTemp.getMonth()+1):nowTemp.getMonth()+1;//今天月
        var day=nowTemp.getDate()<10?'0'+nowTemp.getDate():nowTemp.getDate();//今天日
        var nowDay=year+"-"+month+"-"+day;//今天年月日
        this.nowDay=nowDay;
      },
      //导出Excel函数
      exportExcel:function() {
        //  let wb =XLSX.utils.table_to_book(this.$refs.exportExcel);
         let wb = XLSX.utils.table_to_book(document.querySelector('#out-table'));
         let wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
         try {
             FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'exportExcel.xlsx')
         } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
         return wbout
      },
      //表格处理
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 1) {
            sums[index] = '合计';
            return;
          }
         
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if(index==3){
              sums[index] += '';
            }else if(index==4){
              sums[index] += '';
            }else if(index==5){
              sums[index] += '';
            }else if(index==6){
              sums[index] += '';
            }else{
              sums[index] = '---';
            }
            
          } else {
            sums[index] = '---';
          }
        });
        return sums;
      },
      //初始化获取本周数据
      getOptionAdressMsg:function(){
        this.begintime=this.firstDay;
        this.endtime=this.nowDay;
        // console.log(this.lastfirstDay)
        // console.log(this.lastendDay)
        // console.log(this.firstDay)
        // console.log(this.nowDay)
         let roomid =localStorage.getItem('g_third_userName'); 
         this.$axios({  
          url: '/api/RoomManager',
          method: 'POST',
          //params参数必写 , 如果没有参数传{}也可以
          headers:{
                // Authorization:'Bearer '+token
          },
          params:{  
             roomid: roomid,//（登陆的ID） 
            //  btime: this.begintime,// (查询开始时间） 
            //  etime: this.endtime, //（查询结束时间） 
            //  useridx:0,//（默认为0，保留以后用） 
             pageindex:this.pageindex,//（第几页） 
             pagesize: 10,// （分页条数）
          }
        })
        .then((res)=>{
          // console.log(res.data.data)
          if(res.data.code==100){
            this.$message('查询成功');
            this.allAdressList=res.data.data.list; //zong搜索发货地列表信息
            this.allCount=res.data.data.totalcount; //zong搜索发货地列表信息
          }else if(res.data.code==103){
            this.$router.push({path: '/Login'})
            this.$message('登录过期，请重新登录');
          }else{
            this.$message(res.data.msg);
          }
        })
        .catch((err)=>{
           console.log(err)
        })
      },
       handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
         let roomid =localStorage.getItem('g_third_userName'); 
         this.$axios({  
          url: '/api/RoomManager',
          method: 'POST',
          //params参数必写 , 如果没有参数传{}也可以
          headers:{
                // Authorization:'Bearer '+token
          },
          params:{  
             roomid: roomid,//（登陆的ID） 
            //  btime: this.begintime,// (查询开始时间） 
            //  etime: this.endtime, //（查询结束时间） 
            //  useridx:0,//（默认为0，保留以后用） 
             pageindex:val,//（第几页） 
             pagesize: 10,// （分页条数）
          }
        })
        .then((res)=>{
          // console.log(res.data)
          if(res.data.code==100){
            this.$message('查询成功');
            this.allAdressList=res.data.data.list; //zong搜索发货地列表信息
            this.allCount=res.data.data.totalcount; //zong搜索发货地列表信息
          }else if(res.data.code==103){
            this.$router.push({path: '/Login'})
            this.$message('登录过期，请重新登录');
          }else{
            this.$message(res.data.msg);
          }
        })
        .catch((err)=>{
           console.log(err)
        })
      },
      //删除
      goDelete:function(row){
        // console.log(row.useridx)
        let roomid =localStorage.getItem('g_third_userName'); 
        this.$axios({  
          url: '/api/RoomManager',
          method: 'POST',
          //params参数必写 , 如果没有参数传{}也可以
          headers:{
                // Authorization:'Bearer '+token
          },
          params:{  
            //  roomid: roomid,//（登陆的ID） 
            //  btime: this.begintime,// (查询开始时间） 
            //  etime: this.endtime, //（查询结束时间） 
             useridx:row.useridx,//（默认为0，保留以后用） 
            //  pageindex:val,//（第几页） 
            //  pagesize: 10,// （分页条数）
          }
        })
        .then((res)=>{
          // console.log(res.data)
          if(res.data.code==100){
            this.$message('删除成功');
            // this.allAdressList=res.data.data.list; //zong搜索发货地列表信息
            // this.allCount=res.data.data.totalcount; //zong搜索发货地列表信息
            location.reload()
          }else if(res.data.code==103){
            this.$router.push({path: '/Login'})
            this.$message('登录过期，请重新登录');
          }else{
            this.$message(res.data.msg);
          }
        })
        .catch((err)=>{
           console.log(err)
        })
      }
    }
  }
</script>
<style scoped>


/* .block2{
  text-align:right;
} */
.block_fenye{
  padding-left: 30px;
  padding-right: 30px;
}
.block_fenye .el-pagination__sizes{
  margin-right:450px;
}
.main{
    /* flex: 1; */
    padding-top:10px;
    position: relative;
}
.marsk{
  position: fixed;
  top: 0;
  left: 0; 
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
  z-index: 2999;
}
.pop{
  padding:2% 4%;
  position: fixed;
  top: 9%;
  left: 18%; 
  width: 60%;
  height: 80%;
  background: #fff;
  z-index: 3001;
}
</style>


