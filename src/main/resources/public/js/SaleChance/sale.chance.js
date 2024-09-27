layui.use(['table','layer'],function(){
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //用户列表展示
    /**
     * 加载数据表格
     */
    var  tableIns = table.render({
        //容器元素的ID属性值
        elem: '#saleChanceList',
        //访问数据的URL(后台的数据接口)
        url : ctx+'/sale_chance/list', //数据接口
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
            {field: 'updateDate', title: '修改时间', align:'center'},
            {field: 'state', title: '分配状态', align:'center',templet:function(d){
                    return formatterState(d.state);
                }},
            {field: 'devResult', title: '开发状态', align:'center',templet:function (d) {
                    return formatterDevResult(d.devResult);
                }},
            {title: '操作', templet:'#saleChanceListBar',fixed:"right",align:"center", minWidth:150}
        ]]
    });

    function formatterState(state){
        if(state==0){
            return "<div style='color:yellow '>未分配</div>";
        }else if(state==1){
            return "<div style='color: green'>已分配</div>";
        }else{
            return "<div style='color: red'>未知</div>";
        }
    }

    function formatterDevResult(devResult){
        /**
         * 0-未开发
         * 1-开发中
         * 2-开发成功
         * 3-开发失败
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
                state: $("#state").val() // 状态
            }
            ,page: {
                curr: 1 // 重新从第 1 ⻚开始
            }
        }); // 只重载数据
    });

    //监听头部工具栏事件
    table.on('toolbar(saleChances)', function(data){

        switch(data.event){
            case "add":
                openSaleChanceDialog();
                break;
            case "del":
                deleteSaleChance();
                break;
        }
    });


    /**
     * 行工具栏监听事件
     */
    table.on("tool(saleChances)", function(data){
        if(data.event === "edit") {//编辑操作
            openSaleChanceDialog(data.data.id);
        }else if(data.event  === "del") {//删除操作
            layer.confirm('确定删除当前数据？', {icon: 3, title: "营销机会管理"}, function (index) {
               //关闭确认框
                layer.close(index);
                //发送ajax请求,删除记录
                $.ajax({
                    type:"post",
                    url:ctx+"/sale_chance/delete",
                    data:{
                        ids:data.data.id
                    },
                    success:function (result){
                        //判断删除结果
                        if(result.code==200){
                            //提示成功
                            layer.msg("操作成功！",{icon:6});
                            //刷新表格
                            tableIns.reload();
                        }else{
                            //提示失败
                            layer.msg(data.msg, {icon: 5});
                        }


                    }
                })

            })
        }
    });


    /**
     * 打开添加/修改营销机会数据的窗口
     *   如果营销机会ID为空,则为添加操作
     *   如果营销机会ID不为空,则为修改操作
     * @param saleChanceId
     */
    function openSaleChanceDialog(saleChanceId){
        //弹出层的标题
        var title="<h3>营销机会管理-添加营销机会<h3>";
        var url  =  ctx+"/sale_chance/toSaleChancePage";
        //判断营销机会ID是否为空
        if(saleChanceId != null && saleChanceId != ''){

            title="<h3>营销机会管理-更新营销机会<h3>";
            //请求地址传递营销机会的ID
            url +='?saleChanceId='+saleChanceId;
        }
        layui.layer.open({
            title : title,
            type : 2,
            area:["700px","560px"],
            maxmin:true,
            content : url
        });
    }


    /**
     * 批量删除
     * 删除营销机会(删除多条记录)
     * @param datas
     */
    function deleteSaleChance() {
        //获取数据表格选中的行数据               数据表格的id属性
        var checkStatus=table.checkStatus("saleChanceListTable");
        console.log(checkStatus);
        //获取所有被选中的记录对应的数值
        var saleChanceData=checkStatus.data;

        //判断用户是否选择的记录(选中行的数量大于0)
        if(saleChanceData.length<1){
            layer.msg("请选择删除记录!", {icon: 5});
            return;
        }
        //询问用户是否确认删除
        layer.confirm('确定删除选中的机会数据？',{icon:3,title:'营销机会管理'},function (index) {
            //关闭确认框
            layer.close(index);
            //传递的参数是数组   ids=1&ids=2&ids=3
            var ids="ids=";
            //循环选中的行记录的数据
            for (var i=0;i<saleChanceData.length;i++){
                if (i<saleChanceData.length-1){
                    ids=ids + saleChanceData[i].id + "&ids=";
                }else {
                    ids=ids + saleChanceData[i].id;
                }

            }
            // console.log(ids);
            //发送ajax请求,执行删除营销机会
            $.ajax({
               type:"post",
               url:ctx+"/sale_chance/delete",
               data:ids,  //传递的参数是数组       ids=1&ids=2&ids=3
                success:function (result){
                   //判断删除结果后
                    if (result.code==200){
                        //提示成功
                        layer.msg("删除成功!",{icon:6});
                        //刷新表格
                        tableIns.reload();
                    }else {
                        //提示失败
                        layer.msg(result.msg,{icon:5});
                    }
                }

            });
        });

    }




});

