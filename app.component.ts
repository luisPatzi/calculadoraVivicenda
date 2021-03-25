import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { calculadoracomponent } from './calculadoraviv/calculadora.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})  
export class AppComponent implements OnInit {

  calculadora: any;
  opcionSeleccionado!: string;
  public progvivienda!: any[];
  [x: string]: any;
  
  
  
  constructor() {
    
    this.calculadora=new calculadoracomponent();
    this.calculadora.minimo_nacional=2200;
    this.calculadora.liquido_pagable=0;
    
  }
  
  ngOnInit() {
  
    this.progvivienda =[
      {codigo:1, descripcion:"PRESTAMOS PARA ANTICRETICO DE VIVIENDA", monto_maximo: 20000.00, tasa: 5.50,plazo: 15},
      {codigo:2, descripcion:"PRESTAMOS PARA COMPRA DE VIVIENDA", monto_maximo: 80000.00, tasa: 3.00,plazo: 30},
      {codigo:3, descripcion:"PRESTAMOS PARA CONSTRUCCION DE VIVIENDA", monto_maximo: 80000.00, tasa: 3.00,plazo: 30},
      {codigo:4, descripcion:"PRESTAMOS PARA COMPRA DE TERRENO", monto_maximo: 50000.00, tasa: 3.00,plazo: 30},
      {codigo:5, descripcion:"PRESTAMOS PARA REFACCIÓN AMPLIACION Y CONCLUCION DE OBRA", monto_maximo: 80000.00, tasa: 3.00,plazo: 30}
    ];
    
  }
  calcular()
  {
    
    //
    console.log("calculando");
    
    // el tipo de cambio es constante
    
    var val1, val2, B1, B2, B3, B4, VP1, VP2,VPF,TCD,varBase,varExpo,prestSoli
    
    prestSoli = this.calculadora.monto_solicitado
    
    TCD = 6.96
    B1 = this.calculadora.liquido_pagable * 0.4
    B1 = Math.round((B1 / TCD) * 100) / 100 ;
    
    //console.log("b1--->"+B1);
    
    B2 = this.calculadora.programa.tasa/100;
    //console.log("Tasa ---> " + B2)

    B3 = 12;
    B4 = this.calculadora.plazo_solicitado;

    //console.log("Plazo --> " + B4)

    VP1 = (B1 * B3) / B2;

    //console.log("VP1--->"+VP1);


    varBase = (1 / (1 + B2 / B3));
    varExpo = (B3 * B4);

    //console.log("Bse : " + varBase + "    "  + "Expo : " + varExpo);

    VP2 = Math.pow(varBase,varExpo);
    VP2 = 1 - VP2;


    //console.log("VP2---> " + VP2);
    //console.log("VP1---> " + VP1);
    //console.log("VP2---> " + VP2);
    VPF =  VP1 * VP2;

    //console.log(VPF);

    VPF = Math.round(VPF * 100) / 100 ;
  
    //console.log(VPF);




    if (this.calculadora.monto_solicitado <= this.calculadora.programa.monto_maximo){
      this.calculadora.monto_solicitado = this.calculadora.programa.monto_maximo;
        }

    if (VPF < this.calculadora.monto_solicitado){
      val2 = VPF;
      val1 = Math.round((val2 / 100));
      val1 = val1 * 100;

      if ( val1 > val2){
        val1 = val1 - 100;
      }
      this.calculadora.prestamo = val1;
    }
    else{
      this.calculadora.prestamo = this.calculadora.programa.monto_maximo;
    }


    if (this.calculadora.prestamo >= prestSoli){
      this.calculadora.prestamo = prestSoli
      this.calculadora.monto_solicitado = prestSoli
    }

    //console.log("PRESTAMO---> ok ---> "+this.calculadora.prestamo);

    this.generaResultado();

  }

  capturar()
  {
    this.calculadora.programa=this.progvivienda[this.calculadora.id];
    this.calculadora.monto_solicitado=this.calculadora.programa.monto_maximo;
    this.calculadora.plazo_solicitado=this.calculadora.programa.plazo;
    this.calculadora.prestamo = 0;
    this.calculadora.cuota_mensual = 0;

  }



generaResultado()
{

  var R_PROY, CUO_PROY, reduc_proy, OCredi_Proy,TCD

  TCD = 6.96

  R_PROY = this.calculadora.liquido_pagable * 0.4;
  R_PROY = Math.round((R_PROY / TCD) * 100) / 100;


  OCredi_Proy = this.calculadora.prestamo;
  reduc_proy = 0;

      //console.log("Tasa --> " + this.calculadora.programa.tasa)
        do {
          
          OCredi_Proy = this.calculadora.prestamo - reduc_proy

          CUO_PROY = (Math.round((OCredi_Proy / (this.calculadora.plazo_solicitado*12)) * 100) / 100) + OCredi_Proy * (this.calculadora.programa.tasa /100/12 ) ; 
          
          CUO_PROY = Math.round(CUO_PROY * 100) / 100 ;


          reduc_proy = reduc_proy + 100;
          
          //console.log("Presta : " + OCredi_Proy + " (" + CUO_PROY + "   <   " + R_PROY + ")")


        }
        while (R_PROY < CUO_PROY);

        //console.log(OCredi_Proy);

        this.calculadora.prestamo = OCredi_Proy;



        this.calculadora.cuota_mensual = Math.round((OCredi_Proy  / (this.calculadora.plazo_solicitado*12) ) * 100) / 100
        //console.log("Capital : " + this.calculadora.cuota_mensual);
        
        this.calculadora.cuota_mensual = this.calculadora.cuota_mensual + Math.round((OCredi_Proy * (this.calculadora.programa.tasa /100/12) ) * 100) / 100
        //console.log("Interes : " + this.calculadora.cuota_mensual);

}

}