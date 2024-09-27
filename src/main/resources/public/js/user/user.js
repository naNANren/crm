layui.use(['table','layer',"form"],function(){
       var layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;
    //用户列表展示
    var  tableIns = table.render({
        elem: '#userList',
        url : ctx+'/user/list',
        cellMinWidth : 95,
        page : true,
        height : "full-125",
        limits : [10,15,20,25],
        limit : 10,
        toolbar: "#toolbarDemo",
        id : "userListTable",
        cols : [[
            {type: "checkbox", fixed:"left", width:50},
            {field: "id", title:'编号',fixed:"true", width:80},
            {field: 'userName', title: '用户名称', minWidth:50, align:"center"},
            {field: 'email', title: '用户邮箱', minWidth:100, align:'center'},
            {field: 'phone', title: '手机号', minWidth:100, align:'center'},
            {field: 'trueName', title: '真实姓名', align:'center'},
            {field: 'createDate', title: '创建时间', align:'center',minWidth:150},
            {field: 'updateDate', title: '更新时间', align:'center',minWidth:150},
            {title: '操作', minWidth:150, templet:'#userListBar',fixed:"right",align:"center"}
        ]]
    });


    // 多条件搜索
    /**
     * 绑定搜索按钮的点击事件
     */
    $(".search_btn").click(function () {
        /**
         * 表格重载
         * 多条件查询
         */
        tableIns.reload( {
            //设置需要传递给后端的参数
            where: { //设定异步数据接⼝的额外参数，任意设
                userName: $("[name='userName']").val(), // 用户名称
                email: $("[name='email']").val(), // 邮箱
                phone:$("[name='phone']").val() // 状态
            }
            ,page: {
                curr: 1 // 重新从第 1 ⻚开始
            }
        }); // 只重载数据
    });




    // 头工具栏事件
    table.on('toolbar(users)',function (data) {


        if (data.event =="add") {//添加用户
            //打开添加/修改用户的对话框
            openAddOrUpdateUserDialog();

        }else if (data.event == "del"){//删除用户
            //获取被选中的数据的信息
            var checkStatus=table.checkStatus(data.config.id);
            //删除多个用户记录
            deleteUsers(checkStatus.data)


        }
    });


    /**
     * 删除多条用户记录
     * @param userData
     */
    function deleteUsers(userData) {
       //判断用户是否选择了要删除的记录
        if (userData.length == 0){
            layer.msg("请选择要删除的记录",{icon: 5})
            return;
        }
        //询问用户是否确认删除
        layer.confirm('确定删除选中的记录吗？',{icon:3,title:'用户管理'},function (index) {
            //关闭确认框
            layer.close(index);
            //传递的参数是数组   ids=1&ids=2&ids=3
            var ids="ids=";
            //循环选中的行记录的数据
            for (var i=0;i<userData.length;i++){
                if (i<userData.length-1){
                    ids=ids + userData[i].id + "&ids=";
                }else {
                    ids=ids + userData[i].id;
                }

            }
            // console.log(ids);
            //发送ajax请求,执行删除用户
            $.ajax({
                type:"post",
                url:ctx+"/user/delete",
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










    /**
     * 监听行工具栏
     */
    table.on('tool(users)',function (data) {
        var layEvent =data.event;
        if(layEvent === "edit"){
            openAddOrUpdateUserDialog(data.data.id);
        }else if(layEvent === "del"){
          //删除单条用户记录
            deleteUser(data.data.id);
        }
    });

    //添加或修改用户管理
    function openAddOrUpdateUserDialog(id) {
        var title="<h3>用户管理-用户添加<h3>";
        var url=ctx+"/user/toAddOrUpdateUserPage";
        if(id!=null && id !=''){
            title="<h3>用户管理-用户更新<h3>";
            url=url+"?id="+id;
        }
        layui.layer.open({
            title:title,
            type:2,
            area:["650px","400px"],
            maxmin:true,
            content:url
        })
    }

    /**
     * 删除单条用户记录
     * @param id
     */
    function  deleteUser(id){
        layer.confirm('确定删除当前数据？', {icon: 3, title: "用户管理"}, function (index) {
            //关闭确认框
            layer.close(index);
            //发送ajax请求,删除记录
            $.ajax({
                type:"post",
                url:ctx+"/user/delete",
                data:{
                    ids:id
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
