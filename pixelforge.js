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
    if(lockProcess){return;}
    var elements=headerProcess.children;
    var mainContentPixels=document.querySelector(".mainContent-pixels");
    if(elements[0].innerText=="Image"){
        elements[0].innerText="Pixels";
        elements[2].innerText="Image";
        hideInsideBoxElements();
        mainContentPixels.style.display="flex";
        mainContentPixels.classList.add("styles");
    }else if(elements[0].innerText=="Pixels"){
        elements[0].innerText="Image";
        elements[2].innerText="Pixels"
        showInsideBoxElements();
        mainContentPixels.style.display="none";
    }
});


//mainContent dragging files

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


mainContentPlaceholder1Btn.addEventListener("click",()=>{
    fileInput.value="";
})

var selectedFiles=[];

fileInput.addEventListener("change",(e)=>{
    selectedFiles=Array.from(e.target.files);
    handleSelectedFiles(e.target.files);
})

mainContent.addEventListener("dragover",(e)=>{
    e.preventDefault(); 
    mainContent.classList.add("drag-hover"); 
});

mainContent.addEventListener("dragleave",(e)=>{
    e.preventDefault();
    mainContent.classList.remove("drag-hover");
});

mainContent.addEventListener("drop",(e)=>{
    e.preventDefault(); 
    selectedFiles=Array.from(e.dataTransfer.files);
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

var lockProcess=false;

var handleSelectedFiles=async(files)=>{
    if(files.length>10){alert("You can batch only upto 10 files!");return;}
    if(headerProcess.children[0].innerText=="Image"){
    if(!checkFilesForImageToPixels(files)){alert("Please select image files only!");return;}
    lockProcess=true;
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
     createConvertQueue();
     appendBackContainer();
     appendConvertAllButton();
     createConvertAllFunc();
}
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

var checkFilesForImageToPixels=(files)=>{
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
    row.append(copyContainer);

    var downloadContainer=document.createElement("div");
    row.append(downloadContainer);
    container.append(row);
}


var smallQueue=[];
var trackFinished=[];
let clicked=new Set();
let processing=new Set();
var maxParallelWidth=2000;
var bigQueue = [];
var processingBig = false;
var processingSmall=false;

var createConvertQueue=()=>{
var convertButtons=document.querySelectorAll(".data-table-convert");


for(let i=0;i<convertButtons.length;i++){
    convertButtons[i].addEventListener("click",async()=>{
        if(clicked.has(i)){return;}
        var row=document.querySelectorAll(".data-table-row")[i+1];
        var width=parseInt(row.querySelectorAll(".data-table-pixel")[0].value);
        clicked.add(i);
        console.log("Clicked row button:", index); // DEBUG
        const convert = row.querySelector(".data-table-convert"); 
        convert.classList.add("loading");
        if(width<=maxParallelWidth){
            smallQueue.push(i);
            if(!processingBig&&!processingSmall){
                await processSmallQueue();
            }
        }else{
            bigQueue.push(i);
            if(!processingSmall&&!processingBig){
                await processBigQueue();
            }
        }

    });
}
}

var processBigQueue=async()=>{
    if(processingBig){return;}
    processingBig=true;
    while(bigQueue.length > 0){
        var idx=bigQueue.shift(); 
        await imageToPixels(idx)
    }
    processingBig=false;
    if(smallQueue.length>0){
        await processSmallQueue();
    }
}

var processSmallQueue=async()=>{
    if(processingSmall){return;}
    const promises=[];
    processingSmall=true;
    while(smallQueue.length>0){
        var idx=smallQueue.shift();
        promises.push(imageToPixels(idx));
    }
    await Promise.all(promises);
    processingSmall=false;
    if(bigQueue.length>0){
        await processBigQueue();
    }
}

// ===== Worker Pool =====
const createWorkerPool = (numWorkers) => {
    const pool = [];
    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker(URL.createObjectURL(new Blob([`
            self.onmessage = function(e) {
                const { buffer } = e.data;
                const data = new Uint8ClampedArray(buffer);
                const result = new Uint8ClampedArray(data.length);
                result.set(data);
                self.postMessage({ buffer: result.buffer }, [result.buffer]);
            };
        `], { type: "application/javascript" })));
        pool.push(worker);
    }
    return pool;
};

let workerPool = null;
let conversionQueue = Promise.resolve(); // Queue system

// ===== Main Function =====
async function imageToPixels(z) {
    conversionQueue = conversionQueue.then(() => new Promise((resolve) => {
        const rows = document.querySelectorAll(".data-table-row");
        const row = rows[z + 1];
        const inputs = row.querySelectorAll(".data-table-pixel");
        const width = parseInt(inputs[0].value);
        const height = parseInt(inputs[1].value);
        const type = row.querySelector(".data-table-type").value;
        const file = selectedFiles[z];

        const img = new Image();
        img.onload = async () => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            // Init worker pool once
            if (!workerPool) {
                let numWorkers = Math.max(1, navigator.hardwareConcurrency || 4);
                numWorkers = Math.min(numWorkers, 8);
                workerPool = createWorkerPool(numWorkers);
            }

            const tileSize = 256;
            const tiles = [];
            for (let y = 0; y < height; y += tileSize) {
                for (let x = 0; x < width; x += tileSize) {
                    const w = Math.min(tileSize, width - x);
                    const h = Math.min(tileSize, height - y);
                    const tileData = ctx.getImageData(x, y, w, h);
                    tiles.push({ x, y, w, h, data: tileData });
                }
            }

            const finalBuffer = new Uint8ClampedArray(width * height * 4);

            // Process tiles with worker pool
            for (let t = 0; t < tiles.length; t++) {
                const tile = tiles[t];
                const worker = workerPool[t % workerPool.length];

                await new Promise(res => {
                    worker.onmessage = (e) => {
                        const result = new Uint8ClampedArray(e.data.buffer);
                        for (let rowIdx = 0; rowIdx < tile.h; rowIdx++) {
                            const srcStart = rowIdx * tile.w * 4;
                            const destStart = ((tile.y + rowIdx) * width + tile.x) * 4;
                            finalBuffer.set(result.subarray(srcStart, srcStart + tile.w * 4), destStart);
                        }
                        var convert=rows[z+1].children[4];
                        convert.innerText = "Convert";
                        convert.classList.remove("loading");
                        res();
                    };
                    worker.postMessage({ buffer: tile.data.data.buffer }, [tile.data.data.buffer]);
                });
            }

            // ===== Create Download Button =====
            const downloadBtn = document.createElement("button");
            downloadBtn.classList.add("data-table-download");
            downloadBtn.innerText = "Download";
            row.children[5].append(downloadBtn);

            downloadBtn.addEventListener("click", () => {
                const CHUNK_SIZE = 100000; // pixels per chunk
                const blobParts = [];

                for (let i = 0; i < finalBuffer.length; i += CHUNK_SIZE * 4) {
                    const end = Math.min(i + CHUNK_SIZE * 4, finalBuffer.length);
                    const chunk = [];
                    for (let j = i; j < end; j += 4) {
                        const r = finalBuffer[j], g = finalBuffer[j + 1], b = finalBuffer[j + 2];
                        if (type === "RGB") chunk.push(`rgb(${r},${g},${b})`);
                        else if (type === "HEX") chunk.push(`#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`);
                        else if (type === "HSL") {
                            let r1 = r/255, g1 = g/255, b1 = b/255;
                            let max = Math.max(r1,g1,b1), min = Math.min(r1,g1,b1);
                            let h, s, l = (max + min)/2;
                            if(max === min){ h=s=0; }
                            else {
                                let d = max - min;
                                s = l > 0.5 ? d/(2-max-min) : d/(max+min);
                                switch(max) {
                                    case r1: h=(g1-b1)/d + (g1<b1?6:0); break;
                                    case g1: h=(b1-r1)/d + 2; break;
                                    case b1: h=(r1-g1)/d + 4; break;
                                }
                                h /= 6;
                            }
                            chunk.push(`hsl(${Math.round(h*360)},${Math.round(s*100)}%,${Math.round(l*100)}%)`);
                        }
                    }
                    blobParts.push(chunk.join("\n"));
                }

                const blob = new Blob(blobParts, { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = file.name.replace(/\.[^/.]+$/, "") + "_pixels.txt";
                link.click();
            });

            console.log("File:", file.name, "processed and ready for download!");
            resolve();
        };

        img.src = URL.createObjectURL(file);
    }));

    return conversionQueue;
}

var clickedConvertAll=false;
var createConvertAllFunc=()=>{
    var convertAll=document.querySelector(".convertAll");
    convertAll.addEventListener("click",async()=>{
        if(clickedConvertAll==false){
            convertAll.classList.add("loading");
            convertAll.innerText = "Converting...";
            for(var i=0;i<selectedFiles.length;i++){
                if(clicked.has(i)){continue;}
                var row=document.querySelectorAll(".data-table-row")[i+1];
                var width=parseInt(row.querySelectorAll(".data-table-pixel")[0].value);
                if(width<=maxParallelWidth){
                    smallQueue.push(i);
                    if(!processingBig&&!processingSmall){
                        await processSmallQueue();
                    }
                }else{
                    bigQueue.push(i);
                    if(!processingSmall&&!processingBig){
                        await processBigQueue();
                    }
                }
            }
            clickedConvertAll=true;
            convertAll.classList.remove("loading");
            convertAll.innerText = "Convert All";
        }
    })
}



/*




var copy=document.createElement("button");
    copy.innerText="Copy";
    copy.classList.add("data-table-copy");
    copyContainer.append(copy);


var download=document.createElement("button");
download.classList.add("data-table-download");
    download.innerText="Downlaod";
    downloadContainer.append(download);


*/

var mainContentPixels=document.querySelector(".mainContent-pixels");

headerProcess.addEventListener("click",displayChooseOptions=()=>{

});
