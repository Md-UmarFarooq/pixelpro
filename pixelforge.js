//HEADER TAGLINE
var headerTagline = document.querySelector(".header-tagline");
var headerProcess=document.querySelector(".header-process");
var mainContentContainer=document.querySelector(".mainContent-container");
var mainContent=document.querySelector(".mainContent");
var mainContentPlaceholder1Btn=document.querySelector(".mainContent-placeholder-1-btn");
var fileInput=document.querySelector(".mainContent-fileInput");
var root=document.querySelector(".root");


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
            await sleep(150); 
        }
        await sleep(3000); 
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

var showInsideBoxElements=()=>{
    var insideBoxElements=mainContent.children;
    for(var i=0;i<insideBoxElements.length;i++){
        insideBoxElements[i].style.display="flex";
    }
}

var rows=[];

mainContentPlaceholder1Btn.addEventListener("click",()=>{
    fileInput.value="";
})

fileInput.addEventListener("change",(e)=>{
    handleSelectedFiles(e.target.files);
})

mainContent.addEventListener("dragover",(e)=>{
    e.preventDefault(); 
    mainContent.classList.add("drag-hover"); 
});

mainContent.addEventListener("dragleave",(e)=>{
    mainContent.classList.remove("drag-hover");
});

mainContent.addEventListener("drop",(e)=>{
    e.preventDefault(); 
    if(e.dataTransfer.files.length==0){return;}
    var existingTable=mainContent.querySelector(".data-table");
    if(existingTable){
        return;
    }
    mainContent.classList.remove("drag-hover");
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleSelectedFiles(files); 
    }
});

var handleSelectedFiles=async(files)=>{
    if(files.length>10){alert("You can batch only upto 10 files!");return;}
    if(!checkFiles(files)){alert("Please select image files only!");return;}
    hideInsideBoxElements();
    mainContent.classList.remove("drag");
    mainContent.classList.toggle("transform");
    var table=document.createElement("div");
    table.classList.add("data-table");
    mainContent.append(table);
    fillDataHeadings(table);
    await loadFiles(table,files);
    fillDataHeadings(table);
    for(var i=0;i<files.length;i++){
        await createRow(table,files[i],i);
    }
     appendBackContainer();
     appendConvertAllButton();
}


var appendBackContainer=async()=>{
    var container=document.createElement("div");
    var button=document.createElement("button");
    button.innerText="/ Back";
    container.classList.add("back-container");
    button.classList.add("back");
    container.append(button);
    await root.append(container);
    var back = document.querySelector(".back");
    back.addEventListener("click",()=>{
        var table=document.querySelector(".data-table");
        table.remove();
        showInsideBoxElements();
        mainContent.classList.remove("transform");
        mainContent.classList.add("drag");
        container.remove();
        var convertAllContainer=document.querySelector(".convertAll-container");
        convertAllContainer.remove();
    })
}

var appendConvertAllButton=async()=>{
    var container=document.createElement("div");
    var button=document.createElement("button");
    button.innerText="Convert All";
    container.classList.add("convertAll-container");
    button.classList.add("convertAll");
    container.append(button);
    root.append(container);
}

var checkFiles=(files)=>{
    for(let i = 0;i<files.length;i++){
        const file=files[i];
        if(file.type.startsWith("image/")){
            continue;
        }
        const ext=file.name.split('.').pop().toLowerCase();
        if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)){
            continue;
        }else{
            return false;
        }
    }
    return true;
}



var loadFiles=async(container,files)=>{
    for(var i=0;i<files.length;i++){
        var row=document.createElement("div");
        row.classList.add("data-table-row-loader");
        row.classList.add("data-table-normal");
        var loader=document.createElement("div");
        loader.classList.add("name-loader");
        var loaderBar=document.createElement("div");
        loaderBar.classList.add("loader-bar");
        loader.append(loaderBar);
        row.append(loader);
        container.append(row);
    }
        await new Promise(resolve => setTimeout(resolve, 1700));
        container.innerHTML = "";
}

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

var getImageDimensions=(file)=>{
    return new Promise((resolve,reject)=>{
        if(!file.type.startsWith("image/")){
            return resolve({imgWidth:1920,imgHeight:1080});
        }
        var image=new Image();
        image.onload=()=>{
            resolve({imgWidth:image.naturalWidth,imgHeight:image.naturalHeight});
            URL.revokeObjectURL(image.src);
        }
        image.onerror=reject;
        image.src = URL.createObjectURL(file);
    })
}

var createRow=async (container,file,k)=>{
    var {imgWidth,imgHeight}=await getImageDimensions(file);
    var row=document.createElement("div");
    row.classList.add("data-table-normal");
    row.classList.add("data-table-row");
    var sno=document.createElement("div");
    sno.innerText=(k+1)+".";
    sno.style.fontWeight="bolder"
    row.append(sno);

    var name=document.createElement("div");
    name.innerText=file.name;
    name.classList.add("data-table-name");
    name.style.justifyContent="flex-start";
    name.title = file.name;
    row.append(name);

    var width=document.createElement("input");
    width.type="number";
    width.value=imgWidth;
    width.classList.add("data-table-pixel");
    var height=document.createElement("input");
    height.type="number";
    height.value=imgHeight;
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
    container.append(row);
}







