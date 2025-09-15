export interface FormData {
  plotDimensions: string;
  orientation: string;
  floors: string;
  bedrooms:string;
  bathrooms: string;
  style: string;
  outdoorFeatures: string[];
  specialRooms: string[];
  additionalDetails: string;
}

export interface ShoppingListItem {
  name: string;
  description: string;
  priceRange: string;
}

export interface Plan {
    description: string;
    imageUrl: string;
}

export interface DesignAssets {
  images: string[];
  videoUrl?: string;
  walkthroughScript: string;
  shoppingList: ShoppingListItem[];
  plan2D: Plan;
  plan3D: Plan;
}

export interface GenerationStatus {
  stage: string;
  messages: string[];
}