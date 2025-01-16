#!/bin/bash

# Supported image extensions
SUPPORTED_EXTENSIONS=("jpg" "jpeg" "png" "webp" "bmp" "tiff" "gif")

# Function to check if a file has a supported extension
is_supported_image() {
    local file=$1
    local extension="${file##*.}"
    for ext in "${SUPPORTED_EXTENSIONS[@]}"; do
        if [[ "${extension,,}" == "${ext,,}" ]]; then
            return 0
        fi
    done
    return 1
}

# Function to check and install required tools
check_and_install_tools() {
    # List of required tools
    local tools=("exiftool" "mogrify")
    local missing_tools=()

    # Check for missing tools
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done

    # If no tools are missing, return
    if [ ${#missing_tools[@]} -eq 0 ]; then
        echo "All required tools are installed."
        return
    fi

    # Display missing tools
    echo "The following tools are missing:"
    for tool in "${missing_tools[@]}"; do
        echo " - $tool"
    done

    # Ask user if they want to install missing tools
    read -p "Do you want to install them now? (y/n): " choice
    if [[ "$choice" =~ ^[Yy]$ ]]; then
        # Detect package manager
        if command -v apt &> /dev/null; then
            sudo apt update
            for tool in "${missing_tools[@]}"; do
                sudo apt install -y "$tool"
            done
        elif command -v yum &> /dev/null; then
            sudo yum install -y epel-release # Required for exiftool in some cases
            for tool in "${missing_tools[@]}"; do
                sudo yum install -y "$tool"
            done
        elif command -v brew &> /dev/null; then
            for tool in "${missing_tools[@]}"; do
                brew install "$tool"
            done
        else
            echo "No supported package manager found. Please install the tools manually."
            exit 1
        fi
    else
        echo "Missing tools must be installed manually. Exiting."
        exit 1
    fi
}

# Function to create a backup of files
create_backup() {
    CURRENT_DIR=$(basename "$PWD")
    BACKUP_DIR="../${CURRENT_DIR}_backup"
    mkdir -p "$BACKUP_DIR"
    cp *.* "$BACKUP_DIR/"
    echo "Backup completed. All files copied to $BACKUP_DIR."
}
#!/bin/bash

# Function to list and convert image types
extension_change() {
  # Supported image extensions
  local extensions=("jpg" "jpeg" "png" "webp" "bmp" "tiff" "gif")
  local selected_extension
  local output_extension
  local images=()
  local converted_images=()

  echo "Select the type of images to convert:"
  for i in "${!extensions[@]}"; do
    echo "$((i + 1))) ${extensions[i]}"
  done
  read -p "Enter the number for the source image type: " source_number
  if [[ $source_number -gt 0 && $source_number -le ${#extensions[@]} ]]; then
    selected_extension="${extensions[source_number - 1]}"
  else
    echo "Invalid selection. Exiting."
    return 1
  fi

  read -p "Enter the number for the output image type: " target_number
  if [[ $target_number -gt 0 && $target_number -le ${#extensions[@]} ]]; then
    output_extension="${extensions[target_number - 1]}"
  else
    echo "Invalid selection. Exiting."
    return 1
  fi

  if [[ "$selected_extension" == "$output_extension" ]]; then
    echo "Source and target types are the same. No conversion needed."
    return 1
  fi

  # Find matching images
  images=($(find . -type f -iname "*.${selected_extension}"))
  if [[ ${#images[@]} -eq 0 ]]; then
    echo "No images of type '$selected_extension' found in the current directory."
    return 1
  fi

  echo "The following images will be converted:"
  for i in "${!images[@]}"; do
    echo "$((i + 1))) ${images[i]}"
  done

  read -p "Proceed with the conversion to '${output_extension}'? (y/n): " confirm
  if [[ "$confirm" != "y" ]]; then
    echo "Conversion cancelled."
    return 1
  fi

  # Convert images
  for image in "${images[@]}"; do
    output_file="${image%.*}.${output_extension}"
    convert "$image" "$output_file" && converted_images+=("$output_file")
  done

  if [[ ${#converted_images[@]} -gt 0 ]]; then
    echo "Conversion completed. The following images were converted:"
    for img in "${converted_images[@]}"; do
      echo "$img"
    done
  else
    echo "No images were converted."
  fi
}

# Function to generate an HTML image list
generate_image_list() {
# Ask for confirmation
read -p "Would you like to make images tiny and cute? (y/n): " user_input
# Check user input
if [[ "$user_input" == "y" ]]; then
    # Call resize Function
    resize_or_scale
fi

    local css_folder="../css"
    local css_file="$css_folder/styles.css"

    # Create the parent folder (one level up) if it doesn't exist
    mkdir -p "$(dirname "$css_folder")"

    # Create css folder if it doesn't exist
    mkdir -p "$css_folder"

    # Create the CSS file if it doesn't exist
    touch "$css_file"


    # Create the CSS file and add basic styles
    cat << 'EOF' > "$css_file"
body {
    font-family: Arial, sans-serif;
    padding: 0;
    margin:0;
    background-color: #f0f0f0;
}

.images-container {
    margin: .25em;
  display: flex;
  flex-wrap: wrap;
  font-size: 0;
}

.images-container img {
  margin: .25em;
  overflow: hidden;
  background: #eee;
  flex: 1 1 182px;
  max-height: 108px;
  object-fit: cover;
  cursor: pointer;
  padding: 4px;
  border: 1px solid #aaa;
  font-size: 16px;
}

EOF

# Set the output file one level up
local output_file="../images.html"

# Ensure the parent directory exists
mkdir -p "$(dirname "$output_file")"

# Create or overwrite the output file
> "$output_file"

# Write the initial HTML structure to the output file
cat << 'EOF' > "$output_file"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="description" content="Gallery">
    <title>Gallery</title>
    <link rel="preload" href="css/styles.css" as="style" type="text/css" fetchpriority="high">
    <link rel="stylesheet" href="css/styles.css">
    <script defer src="js/k7.min.js"></script>
</head>
<body>
<div class="images-container">
EOF
local script_dir
script_dir=$(basename "$(pwd)")
# Loop through supported images and append them to the output file
for img in *.*; do
    if is_supported_image "$img"; then
        echo "    <img src=\"$script_dir/$img\" alt=\"$img\" loading=\"lazy\">" >>"$output_file"
    fi
done

# Close the HTML structure
cat << 'EOF' >> "$output_file"
</div>
</body>
</html>
EOF
echo "Image list generated: $output_file"
echo "Do not forget to place the JS folder"
echo "with the gallery script inside the" 
echo "directory where the images.html file exists."
}

# Function to remove metadata
remove_metadata() {
    for img in *.*; do
        if is_supported_image "$img"; then
            echo "Removing metadata: $img"
            exiftool -all= "$img" -overwrite_original
        fi
    done
    echo "Metadata removal complete."
}

# Function to display EXIF data
show_exif_data() {
    for img in *.*; do
        if is_supported_image "$img"; then
            echo "EXIF data for $img:"
            exiftool "$img"
            echo "====================================="
        fi
    done
}

# Function to resize images
resize_or_scale() {
    # Resize or Scale Images
    echo "Resize or Scale Images"

    # Ask for folder name to store larger (original) images
    read -p "Enter folder name to store larger images (originals) [default: large]: " LARGER_FOLDER
    LARGER_FOLDER=${LARGER_FOLDER:-large}  # Use 'photos' if no input is provided
    mkdir -p "$LARGER_FOLDER"  # Create folder if it doesn't exist


    # Ask for the extension name to convert original images to (larger images)
    echo "Select the extension to keep for larger images:"
    for i in "${!SUPPORTED_EXTENSIONS[@]}"; do
        echo "$((i+1))) ${SUPPORTED_EXTENSIONS[$i]}"
    done
    read -p "Enter choice (1-${#SUPPORTED_EXTENSIONS[@]}): " ext_choice
    LARGER_FORMAT=${SUPPORTED_EXTENSIONS[$((ext_choice-1))]}

    # Ask for resize/scaling option
    echo "Select resize option:"
    echo "1) Resize to specific dimensions"
    echo "2) Scale by percentage"
    read -p "Enter choice (1-2): " resize_choice

    # Ask for resized extension (smaller images)
    echo "Select extension for resized (smaller) images:"
    for i in "${!SUPPORTED_EXTENSIONS[@]}"; do
        echo "$((i+1))) ${SUPPORTED_EXTENSIONS[$i]}"
    done
    read -p "Enter choice (1-${#SUPPORTED_EXTENSIONS[@]}): " ext_choice
    SMALLER_FORMAT=${SUPPORTED_EXTENSIONS[$((ext_choice-1))]}

    case $resize_choice in
        1)
            # Resize to specific dimensions
            echo "Select resizing dimensions:"
            echo "1) 192x108"
            echo "2) 300x200"
            echo "3) 500x300"
            echo "4) 800x600"
            echo "5) 1024x768"
            echo "6) 1280x1024"
            echo "7) 1920x1080"

            read -p "Enter choice (1-7): " resize_choice

            case $resize_choice in
                1) RESIZE="192x108" ;;
                2) RESIZE="300x200" ;;
                3) RESIZE="500x300" ;;
                4) RESIZE="800x600" ;;
                5) RESIZE="1024x768" ;;
                6) RESIZE="1280x1024" ;;
                7) RESIZE="1920x1080" ;;
                *) echo "Invalid choice."; return ;;  # Exit if invalid input
            esac
            echo "Resizing images to $RESIZE..."

            # Process images
            for img in *.*; do
                if is_supported_image "$img" && [[ "$img" != l-* ]]; then
                    # Move the original image to the LARGER_FOLDER and convert it to LARGER_FORMAT
                    cp "$img" "$LARGER_FOLDER/$(basename "$img" | sed "s/\.[^.]*$//").$LARGER_FORMAT"
                    mogrify -format "$LARGER_FORMAT" "$LARGER_FOLDER/$(basename "$img" | sed "s/\.[^.]*$//").$LARGER_FORMAT"

                    # Resize and create the resized version with the smaller extension in the working directory
                    cp "$img" "$PWD/$(basename "$img")"  # Copy the original to the working directory
                    mogrify -resize "$RESIZE" -format "$SMALLER_FORMAT" "$PWD/$(basename "$img")"

                    # Ensure that no extra files are created
                    mv "$PWD/$(basename "$img" | sed "s/\.[^.]*$//").$SMALLER_FORMAT" "$PWD/$(basename "$img" | sed "s/\.[^.]*$//").$SMALLER_FORMAT"

                    # Remove the original file extension (if it was different)
                    rm "$PWD/$(basename "$img" | sed "s/\.[^.]*$//").${img##*.}"

                    echo "Processed: $img -> $LARGER_FOLDER/$(basename "$img" | sed "s/\.[^.]*$//").$LARGER_FORMAT (original), $(basename "$img" | sed "s/\.[^.]*$//").$SMALLER_FORMAT (resized)"
                fi
            done
            ;;
        2)
            read -p "Enter scale percentage (e.g., 50 for 50%): " scale
            for img in *.*; do
                if is_supported_image "$img"; then
                    mogrify -resize "$scale%" "$img"
                    echo "Resized: $img by $scale%"
                fi
            done
            ;;
        *)
            echo "Invalid choice for resize option."
            return ;;  # Exit if invalid input
    esac
}
# Function to add a prefix to files
add_prefix_to_images() {
    # Prompt user for prefix with a default value
    read -p "Enter prefix (default: 'l-'): " prefix
    prefix=${prefix:-"l-"}  # Use 'l-' if no input is provided

    echo "Selected prefix: '$prefix'"

    # Initialize a flag to track if any files will be changed
    local files_to_change=false

    # Preview the changes
    echo "The following files will be renamed:"
    for img in *.*; do
        if is_supported_image "$img" && [[ "$img" != "$prefix"* ]]; then
            echo "$img -> $prefix$img"
            files_to_change=true
        fi
    done

    # If no files need renaming, exit early
    if [[ "$files_to_change" == false ]]; then
        echo "No files require prefixing. Exiting."
        return
    fi

    # Ask for confirmation
    read -p "Proceed with renaming? (y/n): " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        for img in *.*; do
            if is_supported_image "$img" && [[ "$img" != "$prefix"* ]]; then
                mv "$img" "$prefix$img"
                echo "Prefixed: $img -> $prefix$img"
            fi
        done
        echo "Renaming completed."
    else
        echo "Operation canceled."
    fi
}

# Menu system
convert_images() {
    while true; do
        clear
        cat << "EOF"
                /\_/\
               ( o.o )
=====================================
   CUTE Batch Image Converter Menu
=====================================
 1) Create backup
 2) Prefix file name
 3) Resize or scale images
 4) Generate image HTML list
 5) Remove image metadata
 6) Show EXIF data
 7) Convert
 8) Exit
=====================================
+++++++++++++++++++++++++++++++++++++
"Tools used for the script:
'exiftool','mogrify'
+++++++++++++++++++++++++++++++++++++
=====================================

EOF
        read -p "Choose an option (1-7): " choice
        case $choice in
        1) create_backup ;;
        2) add_prefix_to_images ;;
        3) resize_or_scale ;;
        4) generate_image_list ;;
        5) remove_metadata ;;
        6) show_exif_data ;;
        7) extension_change ;;
        8) echo "Goodbye and be cute"; exit 0 ;;
        *) echo "Invalid option. Please try again." ;;
        esac
        read -p "Press Enter to continue..."
    done
}

# Ensure tools are installed
check_and_install_tools

# Run the menu
convert_images
