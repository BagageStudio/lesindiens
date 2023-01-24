export default function ({ $config, enablePreview }) {
    if ($config.preview) enablePreview();
}
