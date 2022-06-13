FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.parse(document.body);

$('#fileForm').submit((e)=>{
    e.preventDefault()
    console.log($refs.pond.getFiles())
})