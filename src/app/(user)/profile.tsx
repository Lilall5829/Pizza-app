import { supabase } from "@/lib/supabase";
import { View, Text } from "react-native";
import Button from "@components/Button";

const ProfileScreen = () => {
  return (
    <View>
      {/* <Text>ProfileScreen</Text> */}
      <Button
        text="Sign out"
        onPress={async () => await supabase.auth.signOut()}
      />
    </View>
  );
};

export default ProfileScreen;
