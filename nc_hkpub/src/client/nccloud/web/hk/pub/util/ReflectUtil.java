/**
 *    Copyright 2009-2018 the original author or authors.
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
package nccloud.web.hk.pub.util;

import nc.bs.logging.Logger;

import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;


public class ReflectUtil {


  public static Class<?> getActualTypeArgument(Class<?> clazz) {
    Class<?> entitiClass = null;
    Type genericSuperclass = clazz.getGenericSuperclass();
    if (genericSuperclass instanceof ParameterizedType) {
      Type[] actualTypeArguments = ((ParameterizedType) genericSuperclass)
              .getActualTypeArguments();
      if (actualTypeArguments != null && actualTypeArguments.length > 0) {
        entitiClass = (Class<?>) actualTypeArguments[0];
      }
    }else if(genericSuperclass!=null&&genericSuperclass instanceof Class){
      entitiClass= getActualTypeArgument((Class)genericSuperclass);
    }

    return entitiClass;
  }

  public static <T> T newInstance(Class<T> c)
  {
    try {
      return c.newInstance();
    } catch (InstantiationException e) {
      Logger.error(e.getMessage(),e);
    } catch (IllegalAccessException e) {
      Logger.error(e.getMessage(),e);
    }
    return null;
  }
}
