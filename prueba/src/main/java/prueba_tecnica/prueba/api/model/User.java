package prueba_tecnica.prueba.api.model;

public class User {

    private Integer id;
    private String firstName;
    private String secondName;
    private String firstLastName;
    private String secondLastName;
    private String email;
    private String phoneNumber;
    private String dateOfBirth;
    
    // Dirección
    private String address;
    private String countryName;
    private Integer countryCode;
    private String cityName;
    private Integer cityCode;
    private String municipalityName;
    private Integer municipalityCode;

    public User(int id, String firstName,String secondName,String firstLastName, String secondLastName,String email,String phoneNumber,String dateOfBirth,
    String address, String countryName,Integer countryCode, String cityName,Integer cityCode,String municipalityName, Integer municipalityCode) 
    {
        this.id = id;
        this.firstName = firstName;
        this.secondName = secondName;
        this.firstLastName = firstLastName;
        this.secondLastName = secondLastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.countryName = countryName;
        this.countryCode = countryCode;
        this.cityName = cityName;
        this.cityCode = cityCode;
        this.municipalityName = municipalityName;
        this.municipalityCode = municipalityCode;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getfirstLastName() {
        return firstLastName;
    }

    public void setfirstLastName(String firstLastName) {
        this.firstLastName = firstLastName;
    }

    public String getsecondLastName() {
        return secondLastName;
    }

    public void setsecondLastName(String secondLastName) {
        this.secondLastName = secondLastName;
    }

    public String getfirstName() {
        return firstName;
    }

    public void setfirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getsecondName() {
        return secondName;
    }

    public void setsecondName(String secondName) {
        this.secondName = secondName;
    }

    
    public String getphoneNumber() {
        return phoneNumber;
    }

    public void setphoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getdateOfBirth() {
        return dateOfBirth;
    }

    public void setdateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }
    ///////// address
    
    public String getaddress() {
        return address;
    }

    public void setaddress(String address) {
        this.address = address;
    }

    public String getcountryName() {
        return countryName;
    }

    public void setcountryName(String countryName) {
        this.countryName = countryName;
    }

    public Integer getcountryCode() {
        return countryCode;
    }

    public void setcountryCode(Integer countryCode) {
        this.countryCode = countryCode;
    }

    public String getcityName() {
        return cityName;
    }

    public void setcityName(String cityName) {
        this.cityName = cityName;
    }

    public Integer getcityCode() {
        return cityCode;
    }

    public void setcityCode(Integer cityCode) {
        this.cityCode = cityCode;
    }

    public String getmunicipalityName() {
        return municipalityName;
    }

    public void setmunicipalityName(String municipalityName) {
        this.municipalityName = municipalityName;
    }

    public Integer getmunicipalityCode() {
        return municipalityCode;
    }

    public void setmunicipalityCode(Integer municipalityCode) {
        this.municipalityCode = municipalityCode;
    }
}