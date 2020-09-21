package nccloud.itf.hk.pub;

public interface INCCSecureService {

    String unzip(String str);
    String zip(String str);

    String decrypt(String crypto, String key);

    String encrypt(String data, String key);
}
