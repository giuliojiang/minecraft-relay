import os
import sys
import subprocess
import json

# minecraft-relay/
exec_dir = os.path.abspath(os.path.dirname(os.path.abspath(__file__)) + os.sep + '..')

# minecraft-relay/config.template
template_dir = os.path.abspath(exec_dir + os.sep + 'config.template')

# minecraft-relay/config
config_dir = os.path.abspath(exec_dir + os.sep + 'config')

# Create config directory if it doesn't exist
subprocess.call(['mkdir', config_dir])

for a_config in os.listdir(template_dir):
    template_file = os.path.abspath(template_dir + os.sep + a_config)
    corresponding_file = os.path.abspath(config_dir + os.sep + a_config)
    dest_stem, dest_ext = os.path.splitext(corresponding_file)
    if not os.path.isfile(corresponding_file):
        # copy over from template
        print('Creating configuration file {}'.format(corresponding_file))
        subprocess.call(['cp', template_file, corresponding_file])
    elif dest_ext == '.json':
        # Check consistency of the json configuration files
        source_file = open(template_file, 'r')
        source_obj = json.loads(source_file.read())
        source_file.close()
        dest_file = open(corresponding_file, 'r')
        dest_obj = json.loads(dest_file.read())
        dest_file.close()
        # Check that each key is present
        for source_key in source_obj:
            if not (source_key in dest_obj):
                print('WARNING! Configuration entry {} wasn\'t found in {} file and it has been created for you with default values'.format(source_key, corresponding_file))
                dest_obj[source_key] = source_obj[source_key]
        # Save back to file
        dest_file = open(corresponding_file, 'w')
        dest_file.write(json.dumps(dest_obj, sort_keys=True, indent=4, separators=(',', ': ')))
        dest_file.close()
