package controller;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Collections;

/**
 *
 * @author Xuan
 */
public class ReservationController {   
    
    
    // Send SMS to specified number
    public static boolean sendSMSCode(String number, String id, int type) {
        // Type: 1 = edit, 2=assigned
        String username="AC67bf2dccdfe1e96411f237adab4472f1";//"AC2dda4a62f939804a0ba8bd5397f39072";
        String password="0c28064c5dc5b65bd47da21d9b656e1b";//"8b31ca2f22aa26855e6478ddb2cc7a11";
        String url="https://api.twilio.com/2010-04-01/Accounts/AC67bf2dccdfe1e96411f237adab4472f1/Messages.json";
        String to = "To=+65"+number;
        String from = "From=+12569603664";//+15412334726";
        String body = "";
        if(type==1){
            body = "Body=Job ID: "+ id +" has been edited. Please check on the Laundry Cares App."; 
        }
        else if (type==2){
            body = "Body=Job ID: "+ id +" has been assigned to you. Please check on the Laundry Cares App."; 
        }


        String[] command = {"curl", "-H", "Accept:application/json", "-u", username+":"+password , url, "--data-urlencode", to, "--data-urlencode", from, "--data-urlencode", body };
        ProcessBuilder process = new ProcessBuilder(command); 
        Process p;
        try
        {
            p = process.start();
            BufferedReader reader =  new BufferedReader(new InputStreamReader(p.getInputStream()));
            StringBuilder builder = new StringBuilder();
            String line = null;
            while ( (line = reader.readLine()) != null) {
                builder.append(line);
                builder.append(System.getProperty("line.separator"));
            }
            String result = builder.toString();
            System.out.print(result);
        }
        catch (IOException e)
        {   
            System.out.print("error");
            e.printStackTrace();
            return false;
        }
        return true;
    }
    
   
}
