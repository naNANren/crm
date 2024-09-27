layui.use(['form', 'layer','formSelects'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery;
    var  formSelects = layui.formSelects;


    /**
     *表单Submit监听
     */
    form.on('submit(addOrUpdateUser)',function (data){
        var index= top.layer.msg("数据提交中,请稍后...",{icon:16,
            time:false,
            shade:0.8});
        //得到所有的表单元素的值
        var formData=data.field;

        //请求的地址
        var url=ctx+ "/user/add"
        //判断计划项ID是否为空 (如果不为空,则表示更新)
        if($('[name="id"]').val()){
            url=ctx + "/user/update";
        }

        $.post(url,formData,function (result) {
            if(result.code==200){
                layer.msg("操作成功",{icon: 6});
                //关闭加载层
                top.layer.close(index);
                //关闭弹出层
                top.layer.closeAll("iframe");
                // 刷新父页面,重新加载数据
                parent.location.reload();
            }else{
                layer.msg(result.msg,{icon:5});
            }
        });
        return false;
    });

    /**
     * 关闭当前弹出层
     */
    $("#closeBtn").click(function (){
        //当你在iframe页面关闭自身时
        var index=parent.layer.getFrameIndex(window.name);//先得到当前iframe层的索引
        parent.layer.close(index);  //再执行关闭
    });

    /**
     * 加载角色下拉框数据
     * 1.配置远程搜索,请求头,请求参数,请求类型等
     *
     *
     *  formSelects.config(ID,Options,isJson);
     * ID      xm_select的值
     * Options  配置项
     * isJson  是否传输json数据,true将添加请求头  Content-Type:application/json;charset=UTF-8
     */
    var userId=$("[name='id']").val()
    formSelects.config('selectId',{
        type:"post",
        searchUrl:ctx + "/role/queryAllRoles?userId="+userId,
        //⾃定义返回数据中name的key, 默认 name
        keyName: 'roleName',
        //⾃定义返回数据中value的key, 默认 value
        keyVal: 'id',
        ContentType:'application/json;charset=UTF-8'
    },true)


});