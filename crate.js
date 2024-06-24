let obj; // used for debugging in web-browser console

let ModelMaterialsArray = []; // an array of materials
let ModelAttributeArray = []; // vertices, normals, textcoords, uv

/**
 * Entry Point for HTML <body onload() >
 * Uses Asynchronous HTTP request to load 3D Mesh Model in JSON format
 * 
 */

function myMain() {

    /**
    *   Load external model. The model is stored in
        two Arrays
            * ModelMaterialsArray[]
                each index has set material of uniforms for a draw call
                {ambient, diffuse, specular, ...}

            * ModelAttributeArray[]
                each index contains set of attributes for a draw call
                {vertices, normals, texture coords, indices and materialindex number}

                the materialindex number specifies which index in the ModelMaterialsArray[]
                has the illumination uniforms for this draw call

    */

    // uri is relative to directory containing HTML page
    loadExternalJSON('./model/crate.json');
    

    console.log(ModelMaterialsArray.length);
}

function setUpWebGL() {
        // get webGL context
        // create shader program
        // setup attribute buffers
        // draw/Renderloop
}

/**
 * @function createModelAttributeArray - Extracts the Attributes from JSON and stores them in ModelAttribute Array
 * attributes include {vertices, normals, indices, and texture coordinates}
 * 
 * @param {JSON} obj2 3D Model in JSON Format
 */
function createModelAttributeArray(obj2) {
    // obj.mesh[x] is an array of attributes
    // vertices, normals, texture coord, indices

    // get number of meshes
    let numMeshIndexs = obj2.meshes.length;
    let idx = 0;
    for (idx = 0; idx < numMeshIndexs; idx++) {
        let modelObj = {};

        // get vertices
        modelObj.vertices = obj2.meshes[idx].vertices;
        /* similar for 
            normals (if they exists)
            texture coordinates (if they exists)
            texture (if it exists)
            indices (for drawElements)
            materialIndex (materials to use for these attributes)
        */
        // push onto array
        ModelAttributeArray.push(modelObj);
    }
}
/**
 * @function createMaterialsArray - Extracts the Materials from JSON and stores them in ModelAttribute Array
 * attributes include {ambient, diffuse, shininess, specular and possible textures}
 * @param {JSON} obj2 3D Model in JSON Format
 * 
 */
function createMaterialsArray(obj2){
    console.log('In createMaterialsArray...');
    console.log(obj2.meshes.length);
    // length of the materials array
    // loop through array extracting material properties 
    // needed for rendering
    let itr = obj2.materials.length;
    let idx = 0;

    // each iteration extracts a group of materials from JSON 
    for (idx = 0; idx < itr; idx++) {
        let met = {};
        // shading 
        met.shadingm = obj2.materials[idx].properties[1].value;
        /**
         * similar for
         * ambient
         * diffuse
         * specular
         * shininess
         */


        // object containing all the illumination comp needed to 
        // illuminate faces using material properties for index idx
        ModelMaterialsArray.push(met);
    }
}


// load an external object using 
// newer fetch() and promises
// input is url for requested object
// 

/**
 * loadExternalJson - Loads a 3D Model (in JSON Format)
 *  1. request json file from server
 *  2. call createMaterialsArray 
 *     Populates JavaScript array with Model Materials {ambient, diffuse, shiniess, and textures}
 * 
 *  3. call crateModelAttributeArray
 *     Populates JavaScript array with Model Attributes {vertices, normals, textCoords, }
 * 
 *  4. call setUpWebGL
 *     create WebGL context
 *     Creates and binds buffers
 *     rendering loop
 * 
 * @param {uri} url -- the uri for the 3D Model to load. File should be a JSON format
 */
function loadExternalJSON(url) {
    fetch(url)
        .then((resp) => {
            // if the fetch does not result in an network error
            if (resp.ok)
                return resp.json(); // return response as JSON
            throw new Error(`Could not get ${url}`);
        })
        .then(function (ModelInJson) {
            // get a reference to JSON mesh model for debug or other purposes 
            obj = ModelInJson;
            createMaterialsArray(ModelInJson);
            createModelAttributeArray(ModelInJson);
            setUpWebGL();
        })
        .catch(function (error) {
            // error retrieving resource put up alerts...
            alert(error);
            console.log(error);
        });
}