package com.xxxx.crm.controller;


import com.xxxx.crm.base.BaseController;
import com.xxxx.crm.base.ResultInfo;
import com.xxxx.crm.enums.StateStatus;
import com.xxxx.crm.query.CusDevPlanQuery;
import com.xxxx.crm.query.SaleChanceQuery;
import com.xxxx.crm.service.CusDevPlanService;
import com.xxxx.crm.service.SaleChanceService;
import com.xxxx.crm.utils.LoginUserUtil;
import com.xxxx.crm.vo.CusDevPlan;
import com.xxxx.crm.vo.SaleChance;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 *
 */
@Controller
@RequestMapping("cus_dev_plan")
public class CusDevPlanController extends BaseController {
    @Resource
    private SaleChanceService saleChanceService;

    @Resource
    private CusDevPlanService cusDevPlanService;

    /**
     * 进入客户开发计划页面
     *
     *
     * @return
     */
    @RequestMapping("index")
    public String index(){
     return "cusDevPlan/cus_dev_plan";
    }

    /**
     * 打开计划开发与详情页面
     * @return
     */
    @RequestMapping("toCusDevPlanPage")
    public String toCusDevPlanPage(Integer id, HttpServletRequest request){
      //通过id查询营销机会对象
        SaleChance saleChance=saleChanceService.selectByPrimaryKey(id);
        //将对象设置到请求域
        request.setAttribute("saleChance",saleChance);
        return "cusDevPlan/cus_dev_plan_data";
    }
    /**
     * 客户开发计划数据查询(分页多条件查询)
     * 如果flag的值不为空,且值为1,则表示当前查询的客户开发计划,否则查询营销机会数据
     * @param cusDevPlanQuery
     * @return
     */
    @RequestMapping("list")
    @ResponseBody
    public Map<String,Object> querySaleChanceByParam(CusDevPlanQuery cusDevPlanQuery){

        return cusDevPlanService.queryCusDevPlanQueryByParams(cusDevPlanQuery);
    }

    /**
     * 添加计划项
     * @param cusDevPlan
     * @return
     */
    @PostMapping("add")
    @ResponseBody
    public ResultInfo addCusDevPlan(CusDevPlan cusDevPlan){
     cusDevPlanService.addCusDevPlan(cusDevPlan);
     return success("计划项添加成功!");
    }

    /**
     * 更新计划项
     * @param cusDevPlan
     * @return
     */
    @PostMapping("update")
    @ResponseBody
    public ResultInfo updatedCusDevPlan(CusDevPlan cusDevPlan){
        cusDevPlanService.updateCusDevPlan(cusDevPlan);
        return success("计划项更新成功!");
    }


    /**
     * 删除计划项
     * @param id
     * @return
     */
    @PostMapping("delete")
    @ResponseBody
    public ResultInfo deletedCusDevPlan(Integer id){
        cusDevPlanService.deleteCusDevPlan(id);
        return success("计划项删除成功!");
    }

    /**
     * 进入添加或修改计划项的页面
     * @return
     */
  @RequestMapping("toAddOrUpdateCusDevPlanPage")
  public String toAddOrUpdateCusDevPlanPage(HttpServletRequest request,Integer sId,Integer id){
      //将营销机会ID设置到请求域中,给计划项页面获取
      request.setAttribute("sId",sId);

      //通过计划项ID查询记录
      CusDevPlan cusDevPlan=cusDevPlanService.selectByPrimaryKey(id);
      //将计划项数据设置到请求域中
      request.setAttribute("cusDevPlan",cusDevPlan);
      return "cusDevPlan/add_update";
  }



}
