layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    /**
     * 加载数据表格
     */
    var  tableIns = table.render({
        //容器元素的ID属性值
        elem: '#saleChanceList',
        //访问数据的URL(后台的数据接口)  设置flag参数,表示查询的是客户开发计划页面
        url : ctx+'/sale_chance/list?flag=1', //数据接口
        //单元格最小宽度
        cellMinWidth : 95,
        //开启分页
        page : true,
        //容器的高度 full-差值
        height : "full-125",
        //每页页数可选项
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "saleChanceListTable",
        //表头
        cols : [[
            //field:要求field属性与返回的数据中对应的属性字段名一致
            //title:设置列的标题
            //sort:是否允许排序(默认: false)
            //fixed:固定列
            //
            {type: "checkbox", fixed:"center"},
            {field: "id", title:'编号',fixed:"true"},
            {field: 'chanceSource', title: '机会来源',align:"center"},
            {field: 'customerName', title: '客户名称',  align:'center'},
            {field: 'cgjl', title: '成功几率', align:'center'},
            {field: 'overview', title: '概要', align:'center'},
            {field: 'linkMan', title: '联系人',  align:'center'},
            {field: 'linkPhone', title: '联系电话', align:'center'},
            {field: 'description', title: '描述', align:'center'},
            {field: 'createMan', title: '创建人', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center'},
            {field: 'uname', title: '分配人', align:'center'},
            {field: 'updateDate', title: '修改时间', align:'center'},

            {field: 'devResult', title: '开发状态', align:'center',templet:function (d) {
                    return formatterDevResult(d.devResult);
                }},
            {title: '操作', templet:'#op',fixed:"right",align:"center", minWidth:150}
        ]]
    });


    function formatterDevResult(devResult){
        /**
         * 0-未开发
         * 1-开发中
         * 2-开发成功
         * 3-开发失败
         * 其他未知
         */
        if(devResult==0){
            return "<div style='color: yellow'>未开发</div>";
        }else if(devResult==1){
            return "<div style='color: #00FF00;'>开发中</div>";
        }else if(devResult==2){
            return "<div style='color: #00B83F'>开发成功</div>";
        }else if(devResult==3){
            return "<div style='color: red'>开发失败</div>";
        }else {
            return "<div style='color: #af0000'>未知</div>"
        }
    }
    // 多条件搜索
    /**
     * 绑定搜索按钮的点击事件
     */
    $(".search_btn").click(function () {
        tableIns.reload( {
            //设置需要传递给后端的参数
            where: { //设定异步数据接⼝的额外参数，任意设
                customerName: $("[name='customerName']").val(), // 客户名
                createMan: $("[name='createMan']").val(), // 创建⼈
                devResult:$("#devResult").val()//开发状态
            }
            ,page: {
                curr: 1 // 重新从第 1 ⻚开始
            }
        }); // 只重载数据
    });

    /**
     * 行工具栏监听
     */
    table.on('tool(saleChances)',function (data){
        //判断类型
        if (data.event == "dev"){//开发
            //打开计划项开发与详情页面
            openCusDevPlanDialog("计划项数据开发",data.data.id);

        }else if (data.event == "info"){//详情
            //打开计划项开发与详情页面
            openCusDevPlanDialog("计划项数据维护",data.data.id);
             }
    });

    /**
     * 打开计划项开发或详情页面
     * @param title
     * @param id
     */
    function openCusDevPlanDialog(title,id){
        layui.layer.open({
            title : title,
            type : 2,
            area:["750px","550px"],
            maxmin:true,
            content : ctx+ "/cus_dev_plan/toCusDevPlanPage?id=" +id
        });

    }

});
