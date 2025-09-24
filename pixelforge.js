//HEADER TAGLINE
var headerTagline = document.querySelector(".header-tagline");
var headerProcess=document.querySelector(".header-process");
var mainContent=document.querySelector(".mainContent");
var mainContentPlaceholder1Btn=document.querySelector(".mainContent-placeholder-1-btn");
var fileInput=document.querySelector(".mainContent-fileInput");


const sleep=(delay)=>new Promise((resolve)=>setTimeout(resolve, delay));

async function write() {
    var texts=[
        "Process 10 Images Up to 6000x4000 Instantly",
        "Unlimited Conversions, Forge Pixels Without Limits",
        "Batch 10 Images, Reconstruct Pixels in Seconds"
    ];
    var z=0;
    while(z<texts.length){
        var text=texts[z];
        var insert="";
        for(var i=0;i<text.length;i++){
            insert+=text[i];
            headerTagline.innerText=insert +(i<text.length-1?"|":"");
            if(text[i]=== " ")headerTagline.innerText+="\xa0";
            await sleep(150); // Slower typing
        }
        await sleep(3000); // Longer pause
        z=(z + 1)% texts.length;
    }
}
write();

//HEADER PROCESSTYPE

headerProcess.addEventListener("click",switchProcess=()=>{
    var elements=headerProcess.children;
    console.log(elements[0].innerText)
    if(elements[0].innerText=="Image"){
        elements[0].innerText="Pixels";
        elements[2].innerText="Image"
    }else if(elements[0].innerText=="Pixels"){
        elements[0].innerText="Image";
        elements[2].innerText="Pixels"
    }
});


//mainContent dragginf files

mainContent.classList.add("drag");

mainContentPlaceholder1Btn.addEventListener("click",()=>{
    fileInput.click();
})

var hideInsideBoxElements=()=>{
    var insideBoxElements=mainContent.children;
    for(var i=0;i<insideBoxElements.length;i++){
        insideBoxElements[i].style.display="none";
    }
}

var rows=[];

fileInput.addEventListener("change",(e)=>{
    hideInsideBoxElements();
    var files=e.target.files;
    mainContent.classList.remove("drag");
    mainContent.classList.toggle("transform");
    var table=document.createElement("div");
    table.classList.add("data-table");
    mainContent.append(table);
    fillDataHeadings(table);
    for(var i=0;i<files.length;i++){
        createRow(table,files[i].name,i);
    }

});


var fillDataHeadings=(container)=>{
    var columns=["Sno","Name","Shrink Pixels?","Convert type"];
    var row=document.createElement("div");
    row.classList.add("data-table-row");
    row.classList.add("data-table-header-row");
    for(var i=0;i<7;i++){
        var cell=document.createElement("div");
        row.append(cell);
        if(!columns[i]){continue;}
        cell.innerText=columns[i];
    }
    container.append(row);
}

var createRow=(container,fname,k)=>{
    var row=document.createElement("div");
    row.classList.add("data-table-row");
    var sno=document.createElement("div");
    sno.innerText=(k+1)+".";
    sno.style.fontWeight="bolder"
    row.append(sno);

    var name=document.createElement("div");
    name.innerText=fname;
    name.classList.add("data-table-name");
    name.style.justifyContent="flex-start";
    name.title = fname;
    row.append(name);

    var width=document.createElement("input");
    width.type="number";
    width.value="1920";
    width.classList.add("data-table-pixel");
    var height=document.createElement("input");
    height.type="number";
    height.value="1080";
    height.classList.add("data-table-pixel");
    var pixels=document.createElement("div");
    pixels.classList.add("data-table-pixels");
    pixels.append(width);
    pixels.append(height);
    row.append(pixels);

    var typeContainer=document.createElement("div");
    typeContainer.classList.add("data-table-normal");
    var rgb=document.createElement("option");
    rgb.innerText="RGB";
    var hsl=document.createElement("option");
    hsl.innerText="HSL";
    var hex=document.createElement("option");
    hex.innerText="HEX";
    var type=document.createElement("select");
    type.classList.add("data-table-type");
    type.append(rgb);
    type.append(hsl);
    type.append(hex);
    typeContainer.append(type);
    row.append(typeContainer);

    var convertContainer=document.createElement("div");
    var convert=document.createElement("button");
    convert.innerText="Convert";
    convert.classList.add("data-table-convert");
    convertContainer.append(convert);
    row.append(convertContainer);

    var copyContainer=document.createElement("div");
    var copy=document.createElement("button");
    copy.innerText="Copy";
    copy.classList.add("data-table-copy");
    copyContainer.append(copy);
    row.append(copyContainer);

    var downloadContainer=document.createElement("div");
    var download=document.createElement("button");
    download.innerText="Downlaod";

    download.classList.add("data-table-download");
    downloadContainer.append(download);
    row.append(downloadContainer);
    row.classList.add("data-table-normal");
    container.append(row);

}




