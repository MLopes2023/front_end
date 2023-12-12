
//#region "01-Incializa Constantes, variáveis e efetua leitura url api"

/*
 ---------------------------------------------------------------------------------
   Inicializa variáveis 
 ---------------------------------------------------------------------------------
*/
var paginaAtiva                 = false;
var inputidpaisdocumentovalue	  = 0;
var inputnomepaisdocumentotext  = "";
var inputiddocumentovalue       = 0;
var inputdocumentotext          = "";
var inputidparticipantevalue	  = 0;
var inputnomeparticipantetext   = "";
var inputidclassificacaovalue	  = 0
var inputdescrclassificacaotext = ""

/*
 ---------------------------------------------------------------------------------
   Define constantes
 ---------------------------------------------------------------------------------
*/
const operacao_banco_incluir      = "incluir"
const operacao_banco_alterar      = "alterar"
const operacao_banco_excluir      = "excluir"

/*
 ---------------------------------------------------------------------------------
   Recupera url de acesso as api's
 ---------------------------------------------------------------------------------
*/

var url_api           = "http://127.0.0.1:5000/";

/*
 ---------------------------------------------------------------------------------
   Funções úteis
 ---------------------------------------------------------------------------------
*/

function FormataDataBrasil(paramdata){
  let dia   = dtconvert.getDate();
  let mes   = dtconvert.getMonth();
  let ano   = dtconvert.getFullYear();
  return dia.toString() + "/" + mes.toString() + "/" + ano.toString()
}

function ElementByIdExiste(idElemento){
    
  let existe = false;

  if (typeof(idElemento) != "undefined" && idElemento != null)
      existe = true;
  
  return existe;
}

function ElementValueTextIsNull(valuetext){
    
  let existe = false;

  if (typeof(valuetext) == "undecfined" || valuetext == null)
      existe = true;
  
  return existe;
}

//#endregion

//#region "02-Validação / formato documento CPF/CNPJ"

function retornaTipoDocumentoCpfCnpj(numero){
  let documento = "";
  if (numero.length == 11){
    documento = "CPF";
  }
  else if (numero.length == 14){
    documento = "CNPJ";
  }
  return documento;
}

function validaCpfCnpj(numero){

  let valido         = false;
  let strmsginvalido = "";
  if (isNaN(numero) || isNaN(numero) || parseFloat(numero) == 0) {
      strmsginvalido = "Caracteres devem ser numéricos."
  }
  else if (numero.length > 0 && numero.length < 11){
      strmsginvalido = "Quantidade de caracteres numéricos inválidos."
  }
  else if ((numero.length > 0 ) && (numero.length != 11 && (numero.length < 14 || numero.length > 14))){
      strmsginvalido = "Quantidade de caracteres numéricos inválidos."
  }
  else if (retornaTipoDocumentoCpfCnpj(numero) == "CPF"){
      if (!cpfValido(numero)){
          strmsginvalido = "CPF inválido."
      }
  }
  else if (retornaTipoDocumentoCpfCnpj(numero) == "CNPJ"){
      if (!cnpjValido(numero)){
          strmsginvalido = "CNPJ inválido."
      }
  }
  return strmsginvalido;
}

function cpfValido (cpf) {
  if ( !cpf || cpf.length != 11
          || cpf == "00000000000"
          || cpf == "11111111111"
          || cpf == "22222222222" 
          || cpf == "33333333333" 
          || cpf == "44444444444" 
          || cpf == "55555555555" 
          || cpf == "66666666666"
          || cpf == "77777777777"
          || cpf == "88888888888" 
          || cpf == "99999999999" )
      return false
  var soma = 0
  var resto
  for (var i = 1; i <= 9; i++) 
      soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
  resto = (soma * 10) % 11
  if ((resto == 10) || (resto == 11))  resto = 0
  if (resto != parseInt(cpf.substring(9, 10)) ) return false
  soma = 0
  for (var i = 1; i <= 10; i++) 
      soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
  resto = (soma * 10) % 11
  if ((resto == 10) || (resto == 11))  resto = 0
  if (resto != parseInt(cpf.substring(10, 11) ) ) return false
  return true
}

function cnpjValido(cnpj) {
  if ( !cnpj || cnpj.length != 14
          || cnpj == "00000000000000" 
          || cnpj == "11111111111111" 
          || cnpj == "22222222222222" 
          || cnpj == "33333333333333" 
          || cnpj == "44444444444444" 
          || cnpj == "55555555555555" 
          || cnpj == "66666666666666" 
          || cnpj == "77777777777777" 
          || cnpj == "88888888888888" 
          || cnpj == "99999999999999")
      return false
  var tamanho = cnpj.length - 2
  var numeros = cnpj.substring(0,tamanho)
  var digitos = cnpj.substring(tamanho)
  var soma = 0
  var pos = tamanho - 7
  for (var i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--
    if (pos < 2) pos = 9
  }
  var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(0)) return false;
    tamanho = tamanho + 1
    numeros = cnpj.substring(0,tamanho)
    soma = 0
    pos = tamanho - 7
    for (var i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--
      if (pos < 2) pos = 9
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
    if (resultado != digitos.charAt(1)) return false
    return true;
}

function formatarCampoDocumento(campoTexto) {
  if (campoTexto.value.length <= 11) {
      campoTexto.value = mascaraCpf(campoTexto.value);
  } else {
      campoTexto.value = mascaraCnpj(campoTexto.value);
  }
}

function retirarFormatacaoDocumento(campoTexto) {
  campoTexto.value = campoTexto.value.replace(/(\.|\/|\-)/g,"");
  }
  function mascaraCpf(valor) {
  return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
  }
  function mascaraCnpj(valor) {
  return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
}

function formatarCampoDocumentoStr(strdoc) {

  let strfmtdoc = "";
  
  if (retornaTipoDocumentoCpfCnpj(strdoc) == "CPF"){
    strfmtdoc =  strdoc.substring(0, 3) + "."  + strdoc.substring(3, 6) + '.' + strdoc.substring(6, 9) + '-' + strdoc.substring(9, 11);
  }
  else if (retornaTipoDocumentoCpfCnpj(strdoc) == "CNPJ"){
      strfmtdoc =  strdoc.substring(0, 2) + "."  + strdoc.substring(2, 5) + '.' + strdoc.substring(5, 8) + '/' + strdoc.substring(8, 12) + '-' + strdoc.substring(12, 14);
  }
  return strfmtdoc;
}

function retiraFormatacaoDocumentoStr(strdoc){
  return strdoc.replace(/[^0-9]/g,''); // retorna string retirando caracteres de máscara
}

//#endregion

//#region  03-Combo Boxes"

/*
------------------------------------------------------------------------------------------
  Funções para popular comoboboxes documento e participante
------------------------------------------------------------------------------------------
*/

/* função para selecionar o tipo de documento com base no múmero do documento informando, 
   ou seja, numero do documento = 11 seleciona na combo o tipo de documento CPF e o 
   número do documento igual = 14 retorna seleciona na combo tipo de documento CNPJ. */

function selecionaDocumentoComboBoxe(id_objcmbdocumento, numero_documento) {
  var objcmb = document.getElementById(id_objcmbdocumento);
  var i;
  for (i = 0; i < objcmb.length; i++) {
      if (objcmb.options[i].text == retornaTipoDocumentoCpfCnpj(numero_documento)){
        objcmb.value = objcmb.options[i].value;
        objcmb.text = objcmb.options[i].text;
        break;
      }
  }
}

/* Método de adição de uma linha na combo box país do documento do participante */
const addRowComboBoxPaisDocumento = (id_pais, nome_pais) => {
 
  let combo     = document.getElementById("inputCmbPaisDocumentoReg");
  let option    = document.createElement("option");
  option.text   = nome_pais;
  option.value  = id_pais;
  combo.add(option);
}

/* Método de chamada api para buscar países do documento do participante cadastrados na base de dados */
const getPopulaComboboxPaisDocumento = async () => {

  try{
          
      let consultalista = await fetch(url_api + "/ListarPaises"); 
      let datajson      = await consultalista.json();
      
      addRowComboBoxPaisDocumento (0, "") /* Adiciona primeira linha da combo boxe */

      if (datajson.mesage){
          alert(datajson.mesage);
        }  
      else{
          datajson.paises.forEach(item => addRowComboBoxPaisDocumento(item.id_pais, item.nome_pais));
      }  
  }
  catch(erro){
      console.error("Error:", erro);
  }
}

/* Método de adição de uma linha na combo box documento */
const addRowComboBoxDocumento = (id_documento, documento) => {
 
  let combo     = document.getElementById("inputCmbDocumento");
  let option    = document.createElement("option");
  option.text   = documento;
  option.value  = id_documento;
  combo.add(option);

  let comboReg     = document.getElementById("inputCmbDocumentoReg");
  let optionReg    = document.createElement("option");
  optionReg.text   = documento;
  optionReg.value  = id_documento;
  comboReg.add(optionReg);
  
  let comboPesquisa   = document.getElementById("inputCmbDocumento_p");
  let optionPesquisa  = document.createElement("option");
  optionPesquisa.text  = documento;
  optionPesquisa.value = id_documento;
  comboPesquisa.add(optionPesquisa);
  
}

/* Método de chamada api para buscar documentos do participante cadastrados na base de dados */
const getPopulaComboboxDocumento = async () => {

  try{
          
      let consultalista = await fetch(url_api + "/ListarDocumentos"); 
      let datajson      = await consultalista.json();
      
      addRowComboBoxDocumento (0, "") /* Adiciona primeira linha da combo boxe */

      if (datajson.mesage){
          alert(datajson.mesage);
        }  
      else{
          datajson.documentos.forEach(item => addRowComboBoxDocumento(item.id_documento, item.documento));
      }  
  }
  catch(erro){
      console.error("Error:", erro);
  }
}

/* Método de adição de uma linha na combo box classificação */
const addRowComboBoxClassificacao = (id_class, descricao_class) => {
 
  let comboReg     = document.getElementById("inputcmbClasificacaoReg");
  let optionReg    = document.createElement("option");
  optionReg.text   = descricao_class;
  optionReg.value  = id_class;
  comboReg.add(optionReg);

}

/* Método de chamada api para buscar classificações do participante cadastradas na base de dados */
const getPopulaComboboxClassificacao = async () => {

  try{
          
      let consultalista = await fetch(url_api + "/ListarClassificacoes"); 
      let datajson      = await consultalista.json();
      
      addRowComboBoxClassificacao (0, "") /* Adiciona primeira linha da combo boxe */

      if (datajson.mesage){
          alert(datajson.mesage);
        }  
      else{
          datajson.classificacoes.forEach(item => addRowComboBoxClassificacao(item.id_class, item.descricao_class));
      }  
  }
  catch(erro){
      console.error("Error:", erro);
  }
}

//#endregion

//#region "04-Cadastro de Participantes"


/*
------------------------------------------------------------------------------------------
  Funções do participante da lista restritiva
------------------------------------------------------------------------------------------
*/

/* Abrir formulário modal  */
function openFormParticipante(){
  
  modal = new bootstrap.Modal(document.getElementById("formParticipanteReg"), {
    keyboard: false
  });
  modal.show();
}

/* Fechar formulário modal  */
function closeFormParticipante(){
    document.getElementById("btnCloseModal").click();
}

/* Valida documento do participante do formulario*/
function validaDocumentoParticipante(){
  let msginvalida = validaCpfCnpj(document.getElementById("inputTxtNumeroDocumento").value);
  if (msginvalida != "" ){
    alert(msginvalida);
    document.getElementById("inputTxtNumeroDocumento").value = "";
    document.getElementById("inputTxtNumeroDocumento").focus();
  }
}

/* Valida documento do participante do modal formulario*/
function validaDocumentoParticipanteReg(){
  let msginvalida = validaCpfCnpj(document.getElementById("inputTxtNumeroDocumentoReg").value);
  if (msginvalida != "" ){
    alert(msginvalida);
    document.getElementById("inputTxtNumeroDocumentoReg").value = "";
    document.getElementById("inputTxtNumeroDocumentoReg").focus();
  }
  else {
    selecionaDocumentoComboBoxe("inputCmbDocumentoReg", document.getElementById("inputTxtNumeroDocumentoReg").value );
  }
}

/* Atualiza tabela participante após o formlário modal não estiver ativo na página (Similar OnClose) */
$("#formParticipanteReg").on("hidden.bs.modal", function () {
  postPopulaDataTableParticipante();
});

/* Recupera tabela participante e esconde campos id's */
$(document).ready(function() {
  
    var datatableparticipante = $('#dataTableParticipante').DataTable();

    var indicesColunasParaOcultar = [5, 6, 7, 8 ];

    datatableparticipante.columns(indicesColunasParaOcultar).visible(false);
    datatableparticipante.draw();


    /* Recupera id do participante atual da tabela no evento click da linha atual do grid */
    datatableparticipante.on('click', 'tbody tr', function () {
        let data = datatableparticipante.row(this).data();
        
        // open formulario para edição ou remoção do registro
        OpenFormEditaRemoveParticipante(data)

      }
    )
});

/* Método de inserção de linhas da tabela */
const addNewRowDataTableParticipante = (id_participante, nome_participante, id_class_participante, id_pais_doc_participante, 
                                        id_doc_participante, num_doc_participante, pais_documento, documento, classificacao )  => {
  
  let table = $('#dataTableParticipante').DataTable();
  
  let counter = 1;
  
  table.row
      .add([
          nome_participante,
          pais_documento,
          documento,
          formatarCampoDocumentoStr(num_doc_participante),
          classificacao,
          id_participante,
          id_class_participante,
          id_pais_doc_participante,
          id_doc_participante
      ])
      .draw(false);
      
  counter++;
}

/* Método de chamada api para buscar participantes da lista restritiva cadastrados cadastrados na base de dados */
const postPopulaDataTableParticipante = async () => {

  try{
          
      //define form data de chamada da api
      let formData = new FormData();
      let inputCmbDocumentotext = ""
      let inputTxtNumeroDocumentotext = ""
     
      if (!ElementValueTextIsNull(document.getElementById("inputCmbDocumento").text)){
        inputCmbDocumentotext = document.getElementById("inputCmbDocumento").text;
      }
           
      if (!ElementValueTextIsNull(document.getElementById("inputTxtNumeroDocumento").value)){
        inputTxtNumeroDocumentotext = document.getElementById("inputTxtNumeroDocumento").value;
      }
      formData.append("documento_participante", inputCmbDocumentotext);
      formData.append("num_doc_participante",   retiraFormatacaoDocumentoStr(inputTxtNumeroDocumentotext));

      // Efetua solicitação
      fetch(url_api + "/ListarParticipantes", {
      
        method: "post",
        body: formData
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
            response.json().then(data => {
            console.log(data.participantes)
            // Limpar linhas da tabela 
            var table = new DataTable('#dataTableParticipante');
            table.clear().draw(false); 
            // Adicionar linhas a tabela 
            if( Object.keys(data['participantes']).length === 0 ){
                alert("Não existem informações para listar!")
            }else{
              data.participantes.forEach(item => addNewRowDataTableParticipante(item.id_participante,        item.nome_participante, 
                                                                              item.id_class_participante,  item.id_pais_doc_participante, 
                                                                              item.id_doc_participante,    item.num_doc_participante, 
                                                                              item.pais_documento,         item.documento, 
                                                                              item.classificacao));
            }
          });
        }
        else if (!response.ok) {
          return response.json().then(errorData => {
          console.log(errorData)
          alert(errorData.mesage);
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  catch(erro){
      console.error("Error:", erro);
  }
}

/* declara variável com o indice do participante para uso na edição e remoção do registro */
var id_participante_reg = 0 

/* Limpa campos do formulario de cadastro de participantes */
function LimpaCamposFormParticipante(operacao_banco){
  
  id_participante_reg                                         = 0

  if (operacao_banco != operacao_banco_incluir){
    document.getElementById("inputcmbClasificacaoReg").text     = "";
    document.getElementById("inputcmbClasificacaoReg").value    = 0;
    document.getElementById("inputCmbPaisDocumentoReg").text    = "";
    document.getElementById("inputCmbPaisDocumentoReg").value   = 0;
    document.getElementById("inputCmbDocumentoReg").text        = "";
    document.getElementById("inputCmbDocumentoReg").value       = 0;  
  }
  document.getElementById("inputTxtParticipanteReg").value    = "";
  document.getElementById("inputTxtNumeroDocumentoReg").value = "";
}

/* Open modal formulario para adicionar um novo do cadastro do participante */
const OpenFormAdicionaParticipante = () => {

    //Limpa campos do formulário 
    LimpaCamposFormParticipante("");

    //esconde botões de edição e exclusão
    document.getElementById("btnAdicionarParticipante").style.display = "block"
    document.getElementById("btnEditarParticipante").style.display = "none"
    document.getElementById("btnRemoverParticipante").style.display = "none"

    // open modal formulario 
    openFormParticipante();
}

/* Open formulario de edição ou remoção do cadastro do participante */
function OpenFormEditaRemoveParticipante(datarowtab){
  
  // Limpa campos do formulário 
  LimpaCamposFormParticipante("");

  //popula formulário do registro selecionado da tabela 
  id_participante_reg                                         = datarowtab[5]
  document.getElementById("inputcmbClasificacaoReg").text     = datarowtab[4];
  document.getElementById("inputcmbClasificacaoReg").value    = datarowtab[6];
  document.getElementById("inputTxtParticipanteReg").value    = datarowtab[0];
  document.getElementById("inputCmbPaisDocumentoReg").text    = datarowtab[1];
  document.getElementById("inputCmbPaisDocumentoReg").value   = datarowtab[7];
  document.getElementById("inputCmbDocumentoReg").text        = datarowtab[2];
  document.getElementById("inputCmbDocumentoReg").value       = datarowtab[8];
  document.getElementById("inputTxtNumeroDocumentoReg").value = datarowtab[3];
  
  // Botões 
  document.getElementById("btnAdicionarParticipante").style.display = "none"
  document.getElementById("btnEditarParticipante").style.display = "block"
  document.getElementById("btnRemoverParticipante").style.display = "block"

  // open modal formulario 
  openFormParticipante();
}

/* Função de validação da entrade dados do modal formulário */
function entradaFormParticipanteOk(){
  
  let entradaOk = false;

  if (document.getElementById("inputcmbClasificacaoReg").value == 0){
    alert("Classificação do participante não informada !");
  }
  else if (document.getElementById("inputTxtParticipanteReg").value.trim() === ""){
    alert("Nome do participante não informado !");  
  }
  else if (document.getElementById("inputCmbPaisDocumentoReg").value == 0){
    alert("País do documento não informado !");
  }
  else if (document.getElementById("inputCmbDocumentoReg").value == 0){
    alert("Documento não informado !");  
  }
  else if (document.getElementById("inputTxtNumeroDocumentoReg").value.trim() === ""){
    alert("Número do Documento não informado !");  
  }
  else{
    entradaOk = true
  }

  return entradaOk
}

/* Métodos de atualização no banco de dados via chamada api */
const execApiParticipante = async ( id_participante_reg,      id_class_participante,  
                                    id_pais_doc_participante, id_doc_participante,     
                                    num_doc_participante,     nome_participante, 
                                    operacao_banco ) => {

  //define form data de chamada da api
  let formData = new FormData();
  
  if (operacao_banco == operacao_banco_alterar || operacao_banco == operacao_banco_excluir){
    formData.append("id_participante",    parseInt(id_participante_reg));  
  }
  
  if(operacao_banco != operacao_banco_excluir){

    formData.append("id_class_participante",    parseInt(id_class_participante));
    formData.append("id_pais_doc_participante", parseInt(id_pais_doc_participante));
    formData.append("id_doc_participante",      parseInt(id_doc_participante));
    formData.append("num_doc_participante",     retiraFormatacaoDocumentoStr(num_doc_participante));
    formData.append("nome_participante",        nome_participante);
  }

   // Efetua chamada da api connforme operação
   if (operacao_banco == operacao_banco_incluir)
   {
     fetch(url_api + "/AdicionarParticipante", {
       
        method: "post",
        body: formData
      })
      .then((response) => {
        console.log(response)
        if (response.status === 200) {
            alert("Registro adicionado!")
        }
        else if (!response.ok) {
            return response.json().then(errorData => {
              console.log(errorData)
              alert(errorData.mesage);
            });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    else if (operacao_banco == operacao_banco_alterar)
    {
      
        fetch(url_api + "/EditarParticipante", {
        method: "put",
        body: formData
        })
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
              alert("Registro alterado!")
          }
          else if (!response.ok) {
              
            return response.json().then(errorData => {
            console.log(errorData)
            alert(errorData.mesage);
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      
    }
    else if (operacao_banco == operacao_banco_excluir)
    {
      
        url = url_api + "/RemoverParticipante?id_participante=" + id_participante_reg.toString();

        fetch(url, {
          method: 'delete'
        })
          .then((response) => {
          console.log(response)
          if (response.status === 200) {
            return response.json().then(mesage => {
              console.log(mesage.mensagem)
              alert(mesage.mensagem);
              });
          }
          else if (!response.ok) {
              
            return response.json().then(errorData => {
            console.log(errorData)
            alert(errorData.mesage);
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }      
}

const AdicionarParticipante = () => {
 
    if (entradaFormParticipanteOk()){
     
      // chamada da api para adicionar registro
      execApiParticipante(0,
                       document.getElementById("inputcmbClasificacaoReg").value,
                       document.getElementById("inputCmbPaisDocumentoReg").value,
                       document.getElementById("inputCmbDocumentoReg").value,
                       document.getElementById("inputTxtNumeroDocumentoReg").value,
                       document.getElementById("inputTxtParticipanteReg").value,
                       operacao_banco_incluir );
  
      // Limpa entrada de dados
      LimpaCamposFormParticipante(operacao_banco_incluir)
      
    }
}

const EditarParticipante = () => {

    if (entradaFormParticipanteOk()){
    
      // chamada da api para editar registro
      execApiParticipante(id_participante_reg,
                     document.getElementById("inputcmbClasificacaoReg").value,
                     document.getElementById("inputCmbPaisDocumentoReg").value,
                     document.getElementById("inputCmbDocumentoReg").value,
                     document.getElementById("inputTxtNumeroDocumentoReg").value,
                     document.getElementById("inputTxtParticipanteReg").value,
                     operacao_banco_alterar );

      // close modal formulario               
      closeFormParticipante();

    }
} 

const RemoverParticipante = () => {

  if (entradaFormParticipanteOk()){
     
    // chamada da api para remover registro
    execApiParticipante(id_participante_reg,
                     document.getElementById("inputcmbClasificacaoReg").value,
                     document.getElementById("inputCmbPaisDocumentoReg").value,
                     document.getElementById("inputCmbDocumentoReg").value,
                     document.getElementById("inputTxtNumeroDocumentoReg").value,
                     document.getElementById("inputTxtParticipanteReg").value,
                     operacao_banco_excluir );

      // close modal formulario               
      closeFormParticipante();
  }
} 
  
//#endregion

//#region "05-Simulação Pesquisa Lista Restritiva"


/* Recupera tabela pesquisa */
$(document).ready(function() {
  
    var datatablepesquisa= $('#dataTablePesquisa').DataTable();
    datatablepesquisa.draw();

});

/* Valida documento do participante do formulario pesquisa*/
function validaDocumentoPesquisa(){
  let msginvalida = validaCpfCnpj(document.getElementById("inputTxtNumeroDocumento_p").value);
  if (msginvalida != "" ){
    alert(msginvalida);
    document.getElementById("inputTxtNumeroDocumento_p").value = "";
    document.getElementById("inputTxtNumeroDocumento_p").focus();
  }
}

/* Método de inserção de linhas da tabela */
const addNewRowDataTablePesquisa = (data_pesquisa_fmt_br, nome_participante, 
                                    pais_documento,       documento,  
                                    num_doc_participante, ident_lista,
                                    descricao_status,     observacao_pesquisa  )  => {
  
  let table = $('#dataTablePesquisa').DataTable();
  
  let counter = 1;
  
  table.row
      .add([
          data_pesquisa_fmt_br,
          nome_participante,  
          pais_documento,
          documento,
          formatarCampoDocumentoStr(num_doc_participante),
          ident_lista,
          descricao_status,
          observacao_pesquisa
      ])
      .draw(false);
      
  counter++;
}

function validaDatasFormulario(){

  let lRet = true
  let inputTxtDataInicio_p_value = document.getElementById("inputTxtDataInicio_p").value;
  let inputTxtDataFim_p_value   = document.getElementById("inputTxtDataFim_p").value;

  if (inputTxtDataInicio_p_value === ""){
    document.getElementById("erroCampoRequeridoDataIni").innerHTML = "Este campo é requerido.";
    lRet = false;
  }else{
    document.getElementById("erroCampoRequeridoDataIni").innerHTML = "";
  }

  if (inputTxtDataFim_p_value === ""){
    document.getElementById("erroCampoRequeridoDataFinal").innerHTML = "Este campo é requerido.";
    lRet = false;
  }else{
    document.getElementById("erroCampoRequeridoDataFinal").innerHTML = "";
  }

  return lRet;
}

/* Método de chamada api para buscar as pesquisas de um período de datas ou pelos demais filtros opcionais na base de dados */
const postPopulaDataTablePesquisa = async ( ) => {

  if(validaDatasFormulario()){
    try{
        //define form data de chamada api
        let formData = new FormData();
        let inputCmbDocumentotext = ""
        let inputTxtNumeroDocumentotext = ""

        //set datas da solicitação
        let inputTxtDataInicio_p_value = document.getElementById("inputTxtDataInicio_p").value + " " + "00:00:00";
        let inputTxtDataFim_p_value   = document.getElementById("inputTxtDataFim_p").value + " " + "00:00:00";

        //set combo documento da solicitação
        sel = document.getElementById("inputCmbDocumento_p")
        if(sel.selectedIndex >= 0){
          if (!ElementValueTextIsNull(sel.options[sel.selectedIndex].text)){
            inputCmbDocumentotext = sel.options[sel.selectedIndex].text;
          }
        }else{
          inputCmbDocumentotext = "";
        }
        
        //set número do documento
        if (!ElementValueTextIsNull(document.getElementById("inputTxtNumeroDocumento_p").value)){
          inputTxtNumeroDocumentotext = document.getElementById("inputTxtNumeroDocumento_p").value;
        }

        //set form data
        formData.append("data_pesquisa_inicial", inputTxtDataInicio_p_value);
        formData.append("data_pesquisa_final", inputTxtDataInicio_p_value);
        formData.append("documento_participante", inputCmbDocumentotext);
        formData.append("num_doc_participante",   retiraFormatacaoDocumentoStr(inputTxtNumeroDocumentotext));

        // Efetua solicitação api
        fetch(url_api + "/ListarSimulacoesPesquisasListaRestritiva", {
        
          method: "post",
          body: formData
        })
        .then((response) => {
          console.log(response)
          if (response.status === 200) {
              response.json().then(data => {
              console.log(data.status_listas)
              // Limpar linhas da tabela 
              const table = new DataTable('#dataTablePesquisa');
              table.clear().draw(false); 
              if( Object.keys(data['status_listas']).length === 0 ){
                alert("Não existem informações para listar!")
              }
              else{
                // Adicionar linhas a tabela 
                data.status_listas.forEach(item => addNewRowDataTablePesquisa(  item.data_pesquisa_fmt_br,  item.nome_participante, 
                                                                                item.pais_documento,        item.documento, 
                                                                                item.num_doc_participante,  item.ident_lista, 
                                                                                item.descricao_status,      item.observacao_pesquisa ));
              }
            });
          }
          else if (!response.ok) {
            return response.json().then(errorData => {
            console.log(errorData)
            alert(errorData.mesage);
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
    catch(erro){
        console.error("Error:", erro);
    }

  }
}

//#endregion

//#region "06-Incializa página"

 
/*
-----------------------------------------------------------------------------------------------------------------------
    Incializa pagina
-----------------------------------------------------------------------------------------------------------------------
*/

const InicializaPagina = () => {
  
  var inputDate = document.getElementById("inputTxtDataInicio_p");
  var inputDate2 = document.getElementById("inputTxtDataFim_p");

  var dataAtual = new Date();
  // Formata a data para o formato YYYY-MM-DD
  var dataFormatada = dataAtual.toISOString().slice(0,10);

  // Define o valor do input como a data formatada
  inputDate.value = dataFormatada;
  inputDate2.value = dataFormatada;

  getPopulaComboboxPaisDocumento();
  getPopulaComboboxDocumento();
  postPopulaDataTableParticipante();
  postPopulaDataTablePesquisa();
  getPopulaComboboxClassificacao();
}

if (paginaAtiva == false){
    paginaAtiva = true
    //Event load e realod pagina
    window.addEventListener("load",   () => InicializaPagina());
    window.addEventListener("onload", () => InicializaPagina());
}

//#endregion

