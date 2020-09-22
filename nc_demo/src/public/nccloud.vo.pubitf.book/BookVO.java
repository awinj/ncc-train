package nccloud.vo.pubitf.book;

import nc.vo.pub.IVOMeta;
import nc.vo.pub.SuperVO;
import nc.vo.pub.lang.UFBoolean;
import nc.vo.pub.lang.UFDate;
import nc.vo.pub.lang.UFDateTime;
import nc.vo.pub.lang.UFDouble;
import nc.vo.pubapp.pattern.model.meta.entity.vo.VOMetaFactory;

/**
 * <b> 此处简要描述此类功能 </b>
 * <p>
 *   此处添加累的描述信息
 * </p>
 *  创建日期:2020-9-22
 * @author yonyouBQ
 * @version NCPrj ??
 */

public class BookVO extends SuperVO {

    /**
     *主键
     */
    public java.lang.String pk_book;
    /**
     *ISBN
     */
    public java.lang.String code;
    /**
     *图书名称
     */
    public java.lang.String name;
    /**
     *图书类别
     */
    public java.lang.Integer book_type;
    /**
     *出版社
     */
    public java.lang.String publisher;
    /**
     *出版年
     */
    public java.lang.String vyear;
    /**
     *版次
     */
    public java.lang.String version;
    /**
     *页数
     */
    public java.lang.String page_count;
    /**
     *坐着
     */
    public java.lang.String author;
    /**
     *定价
     */
    public java.lang.String price;
    /**
     *简介
     */
    public java.lang.String brief;
    /**
     *图书状态
     */
    public java.lang.Integer book_status;
    /**
     *集团
     */
    public java.lang.String pk_group;
    /**
     *组织
     */
    public java.lang.String pk_org;
    /**
     *创建人
     */
    public java.lang.String creator;
    /**
     *创建时间
     */
    public UFDateTime creationtime;
    /**
     *修改人
     */
    public java.lang.String modifier;
    /**
     *修改时间
     */
    public UFDateTime modifiedtime;
    /**
     *时间戳
     */
    public UFDateTime ts;


    /**
     * 属性 pk_book的Getter方法.属性名：主键
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getPk_book() {
        return this.pk_book;
    }

    /**
     * 属性pk_book的Setter方法.属性名：主键
     * 创建日期:2020-9-22
     * @param newPk_book java.lang.String
     */
    public void setPk_book ( java.lang.String pk_book) {
        this.pk_book=pk_book;
    }

    /**
     * 属性 code的Getter方法.属性名：ISBN
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getCode() {
        return this.code;
    }

    /**
     * 属性code的Setter方法.属性名：ISBN
     * 创建日期:2020-9-22
     * @param newCode java.lang.String
     */
    public void setCode ( java.lang.String code) {
        this.code=code;
    }

    /**
     * 属性 name的Getter方法.属性名：图书名称
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getName() {
        return this.name;
    }

    /**
     * 属性name的Setter方法.属性名：图书名称
     * 创建日期:2020-9-22
     * @param newName java.lang.String
     */
    public void setName ( java.lang.String name) {
        this.name=name;
    }

    /**
     * 属性 book_type的Getter方法.属性名：图书类别
     *  创建日期:2020-9-22
     * @return nccloud.vo.train.book.BookTypeEnum
     */
    public java.lang.Integer getBook_type() {
        return this.book_type;
    }

    /**
     * 属性book_type的Setter方法.属性名：图书类别
     * 创建日期:2020-9-22
     * @param newBook_type nccloud.vo.train.book.BookTypeEnum
     */
    public void setBook_type ( java.lang.Integer book_type) {
        this.book_type=book_type;
    }

    /**
     * 属性 publisher的Getter方法.属性名：出版社
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getPublisher() {
        return this.publisher;
    }

    /**
     * 属性publisher的Setter方法.属性名：出版社
     * 创建日期:2020-9-22
     * @param newPublisher java.lang.String
     */
    public void setPublisher ( java.lang.String publisher) {
        this.publisher=publisher;
    }

    /**
     * 属性 vyear的Getter方法.属性名：出版年
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getVyear() {
        return this.vyear;
    }

    /**
     * 属性vyear的Setter方法.属性名：出版年
     * 创建日期:2020-9-22
     * @param newVyear java.lang.String
     */
    public void setVyear ( java.lang.String vyear) {
        this.vyear=vyear;
    }

    /**
     * 属性 version的Getter方法.属性名：版次
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getVersion() {
        return this.version;
    }

    /**
     * 属性version的Setter方法.属性名：版次
     * 创建日期:2020-9-22
     * @param newVersion java.lang.String
     */
    public void setVersion ( java.lang.String version) {
        this.version=version;
    }

    /**
     * 属性 page_count的Getter方法.属性名：页数
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getPage_count() {
        return this.page_count;
    }

    /**
     * 属性page_count的Setter方法.属性名：页数
     * 创建日期:2020-9-22
     * @param newPage_count java.lang.String
     */
    public void setPage_count ( java.lang.String page_count) {
        this.page_count=page_count;
    }

    /**
     * 属性 author的Getter方法.属性名：坐着
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getAuthor() {
        return this.author;
    }

    /**
     * 属性author的Setter方法.属性名：坐着
     * 创建日期:2020-9-22
     * @param newAuthor java.lang.String
     */
    public void setAuthor ( java.lang.String author) {
        this.author=author;
    }

    /**
     * 属性 price的Getter方法.属性名：定价
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getPrice() {
        return this.price;
    }

    /**
     * 属性price的Setter方法.属性名：定价
     * 创建日期:2020-9-22
     * @param newPrice java.lang.String
     */
    public void setPrice ( java.lang.String price) {
        this.price=price;
    }

    /**
     * 属性 brief的Getter方法.属性名：简介
     *  创建日期:2020-9-22
     * @return java.lang.String
     */
    public java.lang.String getBrief() {
        return this.brief;
    }

    /**
     * 属性brief的Setter方法.属性名：简介
     * 创建日期:2020-9-22
     * @param newBrief java.lang.String
     */
    public void setBrief ( java.lang.String brief) {
        this.brief=brief;
    }

    /**
     * 属性 book_status的Getter方法.属性名：图书状态
     *  创建日期:2020-9-22
     * @return nccloud.vo.train.book.BookStatusEnum
     */
    public java.lang.Integer getBook_status() {
        return this.book_status;
    }

    /**
     * 属性book_status的Setter方法.属性名：图书状态
     * 创建日期:2020-9-22
     * @param newBook_status nccloud.vo.train.book.BookStatusEnum
     */
    public void setBook_status ( java.lang.Integer book_status) {
        this.book_status=book_status;
    }

    /**
     * 属性 pk_group的Getter方法.属性名：集团
     *  创建日期:2020-9-22
     * @return nc.vo.org.GroupVO
     */
    public java.lang.String getPk_group() {
        return this.pk_group;
    }

    /**
     * 属性pk_group的Setter方法.属性名：集团
     * 创建日期:2020-9-22
     * @param newPk_group nc.vo.org.GroupVO
     */
    public void setPk_group ( java.lang.String pk_group) {
        this.pk_group=pk_group;
    }

    /**
     * 属性 pk_org的Getter方法.属性名：组织
     *  创建日期:2020-9-22
     * @return nc.vo.org.OrgVO
     */
    public java.lang.String getPk_org() {
        return this.pk_org;
    }

    /**
     * 属性pk_org的Setter方法.属性名：组织
     * 创建日期:2020-9-22
     * @param newPk_org nc.vo.org.OrgVO
     */
    public void setPk_org ( java.lang.String pk_org) {
        this.pk_org=pk_org;
    }

    /**
     * 属性 creator的Getter方法.属性名：创建人
     *  创建日期:2020-9-22
     * @return nc.vo.sm.UserVO
     */
    public java.lang.String getCreator() {
        return this.creator;
    }

    /**
     * 属性creator的Setter方法.属性名：创建人
     * 创建日期:2020-9-22
     * @param newCreator nc.vo.sm.UserVO
     */
    public void setCreator ( java.lang.String creator) {
        this.creator=creator;
    }

    /**
     * 属性 creationtime的Getter方法.属性名：创建时间
     *  创建日期:2020-9-22
     * @return nc.vo.pub.lang.UFDateTime
     */
    public UFDateTime getCreationtime() {
        return this.creationtime;
    }

    /**
     * 属性creationtime的Setter方法.属性名：创建时间
     * 创建日期:2020-9-22
     * @param newCreationtime nc.vo.pub.lang.UFDateTime
     */
    public void setCreationtime ( UFDateTime creationtime) {
        this.creationtime=creationtime;
    }

    /**
     * 属性 modifier的Getter方法.属性名：修改人
     *  创建日期:2020-9-22
     * @return nc.vo.sm.UserVO
     */
    public java.lang.String getModifier() {
        return this.modifier;
    }

    /**
     * 属性modifier的Setter方法.属性名：修改人
     * 创建日期:2020-9-22
     * @param newModifier nc.vo.sm.UserVO
     */
    public void setModifier ( java.lang.String modifier) {
        this.modifier=modifier;
    }

    /**
     * 属性 modifiedtime的Getter方法.属性名：修改时间
     *  创建日期:2020-9-22
     * @return nc.vo.pub.lang.UFDateTime
     */
    public UFDateTime getModifiedtime() {
        return this.modifiedtime;
    }

    /**
     * 属性modifiedtime的Setter方法.属性名：修改时间
     * 创建日期:2020-9-22
     * @param newModifiedtime nc.vo.pub.lang.UFDateTime
     */
    public void setModifiedtime ( UFDateTime modifiedtime) {
        this.modifiedtime=modifiedtime;
    }

    /**
     * 属性 生成时间戳的Getter方法.属性名：时间戳
     *  创建日期:2020-9-22
     * @return nc.vo.pub.lang.UFDateTime
     */
    public UFDateTime getTs() {
        return this.ts;
    }
    /**
     * 属性生成时间戳的Setter方法.属性名：时间戳
     * 创建日期:2020-9-22
     * @param newts nc.vo.pub.lang.UFDateTime
     */
    public void setTs(UFDateTime ts){
        this.ts=ts;
    }

    @Override
    public IVOMeta getMetaData() {
        return VOMetaFactory.getInstance().getVOMeta("pubitf.train_book");
    }
}
    