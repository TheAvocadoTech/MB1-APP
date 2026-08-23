// ❌ REMOVE THIS:
// import { Loader } from 'three'; 

//  FIX: Import from lucide-react-native instead
import { Loader } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';

// A valid 3D fallback component
export function LoadingScreen() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="gray" wireframe />
    </mesh>
  );
}
