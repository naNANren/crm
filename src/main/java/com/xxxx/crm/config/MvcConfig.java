package com.xxxx.crm.config;

import com.xxxx.crm.exceptions.NoLoginException;
import com.xxxx.crm.intercpeptor.NoLoginInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class MvcConfig extends WebMvcConfigurerAdapter {
    @Bean  //将方法的返回值交给IOC维护
    public NoLoginInterceptor noLoginInterceptor(){
    return new NoLoginInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        //需要一个实现了拦截器功能的实例对象,这里使用的是noLoginInterceptor
        registry.addInterceptor(noLoginInterceptor())
                //设置需要被拦截的资源
                .addPathPatterns("/**")  //默认拦截所有的资源
                .excludePathPatterns("/css/**","/images/**","/js/**","/lib/**","/index","/user/login");

    }
}
