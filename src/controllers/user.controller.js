import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.js";
import { uplodeOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {

    // get user detail from frontend
    // validation - not empty
    // check if user already exist
    // check if email or username already exist
    // check for images, check for avatar
    // Upload them to cloudinary, avatar 
    // create user object - create entry in db
    // remove password and refresh token feild from responce
    // check for user creation
    // return res

    const { username, fullname, email, password } = req.body

    if (
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required");
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with username or email alredy exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uplodeOnCloudinary(avatarLocalPath);
    const coverImage = await uplodeOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = User.findById(user._id)
    .select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export { registerUser }